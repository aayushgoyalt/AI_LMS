package LM

import (
  "os/exec"
)

func convert(path string) (error){
  cmd := exec.Command("pdftocairo", path, "-png", "")
  output, err := cmd.Output()
  if err != nil {
    return "", err
  }
  return string(output), nil
}

