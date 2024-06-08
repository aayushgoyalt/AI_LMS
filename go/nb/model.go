package LM

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/google/generative-ai-go/genai"
)

/// Convert text to tokens
func partsTXT(text string) genai.Part {
  return genai.Text(text)
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
  fmt.Println("ADDING")
}

/// convert and add a png at `location` to tokens pool
func (model *Model) addPNG(location string) error{
  file, err := os.ReadFile(location)
  if err != nil {
    return err
  }
  model.add(genai.ImageData("png", file))
  return nil
}

/// convert and add text to tokens pool
func (model *Model) AddTXT(text string) {
  model.add(partsTXT(text))
}

/// convert and a file text to tokens pool
func (model *Model) AddFILE(name string, dir string) error {
  if err := convert(dir +"/"+ name); err != nil {
    return err
  }
  list, err := os.ReadDir(dir+"/"+name+"_")
  if err != nil {
    return errors.New("AddFILE opendir error")
  }
  for _, file := range list {
    png_name := file.Name()
    if png_name[0] == '-' {
      if err := model.addPNG(dir+"/"+name+"_/"+png_name); err != nil {
	return err
      }
    }
  }
  return nil
}

