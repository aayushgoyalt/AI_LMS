package LM

import (
  "errors"
  "os/exec"
)

/// Convert pdf to png, txt
func pdfConv(path string) error { // Text??
  cmd := exec.Command("pdftocairo", "-png", path, path + "/" )
  if err := cmd.Run(); err != nil {
    return err
  }
  return nil
}

/// Convert doc docx ppt pptx to pdf and then to png
func otherConv(path string) error {
  cmd := exec.Command("unoconv", "-fpng", "-o"+path+"/out.pdf", path)
  if err := cmd.Run(); err != nil {
    return err
  }
  cmd = exec.Command("pdftocairo", "-png", path+"/out.pdf", path + "/" )
  if err := cmd.Run(); err != nil {
    return err
  }
  return nil
}

/// Convert file to png and text for the model
func convert(path string) error {
  file_type_cmd := exec.Command("file", "-b", "--extension", path)
  file_type, err := file_type_cmd.Output()
  if err != nil {
    return err
  }
  switch string(file_type) {
  case "pdf": return pdfConv(path)
  case "pptx": case "ppt/pps/pot": case "docx": case "doc/dot/": return otherConv(path)
  }
  return errors.New("convert FileType error")
}

