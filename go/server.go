package main

import (
  "bytes"
  "context"
  "encoding/json"
  "errors"
  "log"
  "LM/nb"
  "os"
  
  "fmt"
  "net/http"
  
  "github.com/gin-gonic/gin"
  "github.com/gorilla/websocket"
  
  "github.com/google/generative-ai-go/genai"
  "google.golang.org/api/option"
)

const route = "127.0.0.1:8080"
const api_key = "AIzaSyBAyolaqLVrjxNjBq557YyYbjTvxZ1pfdY"

var upgrader = websocket.Upgrader{
  ReadBufferSize:  1024,
  WriteBufferSize: 1024,
}


/// respond to the ask request
func handleResp(model *LM.Model) error{
  resp, err := model.Ask()
  if err != nil {
    return err
  }
  if resp == nil || len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil || len(resp.Candidates[0].Content.Parts) == 0{
    return errors.New("handleResp respose error")
  } else {
    switch p := resp.Candidates[0].Content.Parts[0].(type) {
    case genai.Text:
      return errors.New(string(p))
    default:
      fmt.Println("Unknown genai.Part type:", p)
      return errors.New("handleResp unknown respose type error")
    }
  }
}

/// handle binary message sent to ws
func handleFileUpload(message []byte, dir string) error {
  // if len(message) < 4 {
  //   return errors.New("handleFileUpload data error")
  // }
  // slice_num := binary.BigEndian.Uint32(message)
  // _ = slice_num
  data := message

  parts := bytes.SplitN(data, []byte{0}, 4)
  if len(parts) < 2 || parts[1] == nil {
    return errors.New("handleFileUpload parts error")
  }

  fileHash := string(parts[0])
  payload := parts[1]

  if len(payload) > (1<<20) {
    return errors.New("handleFileUpload len violation") // Be Safe ?
  }
  
  f, err := os.OpenFile(dir + "/" + fileHash, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
  if err != nil {
    return err
    // return errors.New("handleFileUpload file open error")
  }
  defer f.Close()

  _, err = f.Write(payload)
  if err != nil {
    return errors.New("handleFileUpload file write error")
  }

  return nil
}

/// Handle text message sent to ws
func handleTextMessage(message []byte, dir string, model *LM.Model ) error {
  var req struct {
    Command int32  `json:"C"`
    Message string `json:"M"`
  }
  if err := json.Unmarshal(message, &req); err != nil {
    fmt.Println(err)
    return errors.New("Error invalid message json")
  }

  switch req.Command {
  case -2: // AskJson
    model.Json(true)
    return handleResp(model)
  case -1: // Ask
    model.Json(false)
    return handleResp(model)
  case 0: // Clear Model
    model.Parts = nil
    return nil
  case 1: // AddTXT
    model.AddTXT(req.Message)
    return nil
  case 2: // AddFile
    model.AddFILE(req.Message, dir);
    return nil
  default:
    return errors.New("Invalid Command")
  };
}

/// The main server function
func serve() error{
  fmt.Println("Starting on", route)

  client, err := genai.NewClient(context.Background(), option.WithAPIKey(api_key))
  if err != nil {
    return err
  }

  router := gin.Default()
  router.MaxMultipartMemory = 32 << 20 // 32 MiB
  router.GET("/ws",
    func (c *gin.Context) {
      conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
      if err != nil {
        c.JSON(http.StatusInternalServerError, err.Error())
        return
      }
      defer conn.Close()

      model := LM.Model{};
      err = model.Init("gemini-1.0-pro", client, nil)
      if err != nil{
        c.JSON(http.StatusInternalServerError, err.Error())
        return
      }
      dir := os.TempDir() + "/AI_LMS"

      for {
        messageType, message, err := conn.ReadMessage()
        if err != nil {
          if websocket.IsCloseError(err, websocket.CloseNormalClosure) {
            fmt.Println("Connection closed cleanly")
            return
          }
          fmt.Println("Error reading message: ", err)
          break
        }
        switch (messageType){
        case websocket.PingMessage:
          _ = conn.WriteMessage(websocket.PongMessage, message)
          continue
        case websocket.TextMessage:
          if err := handleTextMessage(message, dir, &model); err != nil {
            _ = conn.WriteMessage(websocket.TextMessage, []byte(string(err.Error()))) // Improve
            continue
          }
        case websocket.BinaryMessage:
          if err := handleFileUpload(message, dir); err != nil {
            _ = conn.WriteMessage(websocket.TextMessage, []byte(string(err.Error()))) // Improve
            continue
          }
        };
        _ = conn.WriteMessage(websocket.TextMessage, []byte("0"))
      }
    },
  );
  router.Static("/app", "./dist")
  router.Run(route)
  return nil
}

func main(){
  if err := os.Mkdir(os.TempDir() + "/AI_LMS", os.ModePerm); err != nil {
    fmt.Println(err)
  }
  err := serve();
  if err != nil {
    log.Fatal("cannot initialize server")
  }
  log.Fatal("unrecoverable error")
}

