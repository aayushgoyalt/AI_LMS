package LM

import (
  "os"
  "log"
  "context"
  
  "github.com/google/generative-ai-go/genai"
)

func PartsTXT(text string) genai.Part {
  return genai.Text(text)
}

func PartsPNG(location string) (genai.Part, error){
  part, err := os.ReadFile(location)
  if err != nil {
    return nil, err
    log.Fatal("The file ",location," does not exist")
  }
  return genai.ImageData("png", part), nil
}

type Model struct {
  model *genai.GenerativeModel;
  cs *genai.ChatSession;
  ctx context.Context;
  Parts []genai.Part;
  prev bool;
}

  // his := []*genai.Content{
  //   &genai.Content{
  //     Parts: []genai.Part{
  //       genai.Text("Remember the following context."),
  //     },
  //     Role: "user",
  //   },
  //   &genai.Content{
  //     Parts: []genai.Part{
  //       genai.Text("Give me the context and i will remember it."),
  //     },
  //     Role: "model",
  //   },
  // }

func (model *Model) Init(client *genai.Client ,history []*genai.Content) error {
  model.Parts = nil
  model.ctx = context.Background()
  model.model = client.GenerativeModel("gemini-1.5-flash")
  model.cs = model.model.StartChat()
  if history != nil {
    model.cs.History = history
  }
  model.prev = false
  return nil
}

func (model *Model) Json(huh bool){
  if model.prev == huh{
    return
  } else if huh == true {
    model.model.GenerationConfig.ResponseMIMEType = "application/json"
  } else {
    model.model.GenerationConfig.ResponseMIMEType = "plain/text"
  }
  model.prev = huh
  model.cs = model.model.StartChat()
}


func (model *Model) Ask() (*genai.GenerateContentResponse, error){
  resp, err := model.cs.SendMessage(model.ctx, model.Parts...)
  model.Parts = nil
  if err != nil {
    return nil ,err
  }
  return resp, nil
}

func (model *Model) Add(part genai.Part) {
  model.Parts = append(model.Parts, part)
}

func (model *Model) AddTXT(text string) {
  model.Add(PartsTXT(text))
}

func (model *Model) addPNG(location string) error{
  part, err := PartsPNG(location)
  if err != nil {
    return err
  }
  model.Add(part)
  return nil
}

func (model *Model) AddFILE(name string, dir string) error {
  if dir == "" {
    dir = os.TempDir() + "/AI_LMS"
  }
  // path := dir + "/" + name
  return nil
}


