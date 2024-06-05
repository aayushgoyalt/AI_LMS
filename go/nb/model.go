package LM

import (
	"context"
	"errors"
	"log"
	"os"

	"github.com/google/generative-ai-go/genai"
)

/// Convert text to tokens
func partsTXT(text string) genai.Part {
  return genai.Text(text)
}

/// Convert png to tokens
func partsPNG(location string) (genai.Part, error){
  part, err := os.ReadFile(location)
  if err != nil {
    return nil, err
    log.Fatal("The file ",location," does not exist")
  }
  return genai.ImageData("png", part), nil
}

/// The LM interface
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

/// Initialize the model
func (model *Model) Init(name string, client *genai.Client, history []*genai.Content) error {
  model.Parts = nil
  model.ctx = context.Background()
  model.model = client.GenerativeModel(name)
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
  // model.cs = model.model.StartChat()
}


func (model *Model) Ask() (*genai.GenerateContentResponse, error){
  if model.Parts == nil {
    return nil,errors.New("Ask nothing error")
  }
  resp, err := model.cs.SendMessage(model.ctx, model.Parts...)
  model.Parts = nil
  if err != nil {
    return nil ,err
  }
  return resp, nil
}

/// add `part` to tokens pool
func (model *Model) add(part genai.Part) {
  model.Parts = append(model.Parts, part)
}

/// convert and add a png at `location` to tokens pool
func (model *Model) addPNG(location string) error{
  part, err := partsPNG(location)
  if err != nil {
    return err
  }
  model.add(part)
  return nil
}

/// convert and add text to tokens pool
func (model *Model) AddTXT(text string) {
  model.add(partsTXT(text))
}

/// convert and a file text to tokens pool
func (model *Model) AddFILE(name string, dir string) error {
  convert(dir + name)
  return nil
}

