package notebook

import (
  "os/exec"
)

func Curl_pdf_to_text(str string) (string, error){
  cmd := exec.Command("pdftotext",str,"-")
  output, err := cmd.Output()
  if err != nil {
    return "", err
  }
  return string(output), nil
}

