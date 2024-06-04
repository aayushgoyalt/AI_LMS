package main

import (
  "context"
  "encoding/json"
  "notebook/nb"
  
  "fmt"
  "net/http"
  
  "github.com/gin-gonic/gin"
  "github.com/gorilla/websocket"
  
  "github.com/google/generative-ai-go/genai"
  "google.golang.org/api/option"
)


type RR struct {
  Command int32  `json:"C"`
  Message string `json:"M"`
}

const api_key = "AIzaSyBAyolaqLVrjxNjBq557YyYbjTvxZ1pfdY"

var upgrader = websocket.Upgrader{
  ReadBufferSize:  1024,
  WriteBufferSize: 1024,
}

const route = "127.0.0.1:8080"

func handleResp(conn *websocket.Conn, resp *genai.GenerateContentResponse) error{
  if resp == nil || len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil || len(resp.Candidates[0].Content.Parts) == 0{
    conn.WriteMessage(websocket.TextMessage, []byte("Unknown Error: model.Ask()"))
  } else {
    // conn.WriteMessage(websocket.TextMessage, []byte(string(resp.Candidates[0].Content.Parts[0])))
  }
  return nil
}

// func handleFileUpload(conn *websocket.Conn, model *notebook.Model) error {
//   // Define a struct to store file upload information
//   type FileUpload struct {
//     Filename string `json:"filename"`
//     Size     int64  `json:"filename"`
//     Data     []byte `json:"data"`
//     Complete bool   `json:"complete"`
//   }
//
//   var uploadBuffer []byte // Buffer to accumulate file chunks
//
//   for {
//     messageType, message, err := conn.ReadMessage()
//     if err != nil {
//       if websocket.IsCloseError(err, websocket.CloseNormalClosure) {
//         fmt.Println("Connection closed cleanly")
//         return nil
//       }
//       fmt.Println("Error reading message:", err)
//       conn.WriteMessage(websocket.TextMessage, []byte("Error reading file upload"))
//       return err
//     }
//
//     if messageType == websocket.TextMessage {
//       var req FileUpload
//       if err := json.Unmarshal(message, &req); err != nil {
//         fmt.Println("Error invalid file upload json")
//         conn.WriteMessage(websocket.TextMessage, []byte("Error: Invalid file upload data"))
//         continue
//       }
//
//       if req.Filename == "" || req.Size <= 0 {
//         fmt.Println("Invalid file upload data")
//         conn.WriteMessage(websocket.TextMessage, []byte("Error: Invalid file information"))
//         continue
//       }
//
//       // Accumulate data chunks
//       uploadBuffer = append(uploadBuffer, req.Data...)
//
//       if req.Complete {
//         // Process complete file
//         err := processUploadedFile(uploadBuffer, req.Filename, model)
//         if err != nil {
//           fmt.Println("Error processing uploaded file:", err)
//           conn.WriteMessage(websocket.TextMessage, []byte("Error uploading file"))
//           return err
//         }
//         uploadBuffer = nil // Reset buffer for next upload
//         conn.WriteMessage(websocket.TextMessage, []byte("File upload successful"))
//         break
//       }
//     } else {
//       fmt.Println("Unexpected message type:", messageType)
//       conn.WriteMessage(websocket.TextMessage, []byte("Error: Unexpected message format"))
//       continue
//     }
//   }
//
//   return nil
// }


func handleMessage(messageType int, message []byte, conn *websocket.Conn, model *notebook.Model ) error {
  if messageType == websocket.PingMessage {
    if err := conn.WriteMessage(websocket.PongMessage, message) ; err != nil{
      return nil
    }
  } else if messageType == websocket.TextMessage {
    var req RR
    if err := json.Unmarshal(message, &req); err != nil {
      fmt.Println("Error invalid message json")
      conn.WriteMessage(websocket.TextMessage, []byte("Unknown Error: json.Unmarshal()"))
      return err
    }

    switch req.Command {
    case -2: // AskJson
      model.Json(true)
      resp, err := model.Ask()
      if err != nil {
        conn.WriteMessage(websocket.TextMessage, []byte(string(err.Error())))
        return err
      }
      return handleResp(conn, resp)
    case -1: // Ask
      model.Json(false)
      resp, err := model.Ask()
      if err != nil {
        conn.WriteMessage(websocket.TextMessage, []byte(string(err.Error())))
        return err
      }
      return handleResp(conn, resp)
    case 0: // Clear Model
      model.Parts = nil
    case 1: // Ask
      model.AddTXT(req.Message)
      conn.WriteMessage(websocket.TextMessage, []byte("0"))
    case 2: // File Upload
      // handleFileUpload(...)
      conn.WriteMessage(websocket.TextMessage, []byte("0"))
    default:
      fmt.Println("Error invalid Id / Message command")
      conn.WriteMessage(websocket.TextMessage, []byte("Invalid Command"))
    }
  }
  return nil
}

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

      model := notebook.Model{};
      err = model.Init(client, nil)
      if err != nil{
        c.JSON(http.StatusInternalServerError, err.Error())
        return
      }

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
        handleMessage(messageType, message, conn, &model)
      }
    },
  );
  router.Static("/app", "../js/corel/dist")
  router.Run(route)
  return nil
}


func main(){
  his := []*genai.Content{
    &genai.Content{
      Parts: []genai.Part{
        genai.Text("From Now on, you will respond in Json"),
      },
      Role: "user",
    },
    &genai.Content{
      Parts: []genai.Part{
        genai.Text("{'okay': true}"),
      },
      Role: "model",
    },
  }
  _ = his
  his = nil

  client, _ := genai.NewClient(context.Background(), option.WithAPIKey(api_key))
  model := notebook.Model{};
  _ = model.Init(client, his)

  model.AddTXT("Mcq on science")
  resp, err := model.Ask();
  if err != nil {
    panic("Reaponse Err")
  }

  parts := resp.Candidates[0].Content.Parts
  for _, j := range parts {
    // fmt.Println(">>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<")
    fmt.Println(j)
  }
  
}

