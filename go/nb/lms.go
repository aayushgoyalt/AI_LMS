package notebook

import (
  "bytes"
  "errors"
  "fmt"
  "io"
  "net/http"
  "strings"
  "time"
)


type Session struct {
  Cookie string
  Sesskey string
}

const size = 1024
var http_buff chan *http.Client = make(chan *http.Client, size)

func Make_connection_buffer(){
  for range size {
    http_buff <- &http.Client{
      Transport: &http.Transport{},
      Timeout: 10 * time.Second,
    }
  }
}

func Get_lms_cookie(username string, password string) (*Session, error) {
  s := Session{"",""}
  // Use buffer to make requests
  client := <- http_buff
  defer func(){http_buff <- client}()
  var location string

  {
    req, err := http.NewRequest("POST","https://lms.thapar.edu/moodle/login/index.php", bytes.NewBuffer([]byte("username="+username+"&password="+password)))
    if err != nil {
      return &s, err
    }
    res, err := client.Do(req)
    if err != nil {
      return &s, err
    }
    res.Uncompressed = false
    io.Copy(io.Discard, res.Body)
    res.Body.Close()

    cookie_header_list := res.Header["Set-Cookie"]
    if len(cookie_header_list)<1 {
      return &s, errors.New("No cookie")
    }

    for _, i := range cookie_header_list {
      if strings.HasPrefix(i, "MoodleSession=") && len(i) > 40 {
	s.Cookie = i[:40]
      }
    }
    if s.Cookie == "" {
      return &s, errors.New("No Cookie recieved")
    }

    l := res.Header["Location"]
    fmt.Println(res.Location())
    if len(l) < 1 {
      return &s, errors.New("No Location")
    }
    location = l[0]
  }

  {
    req, err := http.NewRequest("GET",location, nil)
    if err != nil {
      return &s, err
    }
    req.Header.Add("Cookie", s.Cookie)

    res, err := client.Do(req)
    if err != nil {
      return &s, err
    }

    io.Copy(io.Discard, res.Body)
    res.Body.Close()

    fmt.Println("Headers: ",res.Header)
  }

  {
    req, err := http.NewRequest("GET","https://lms.thapar.edu/moodle/my/", nil)
    if err != nil {
      return &s, err
    }
    req.Header.Add("Cookie", s.Cookie)

    res, err := client.Do(req)
    if err != nil {
      return &s, err
    }
    res.Uncompressed = true
    
    var temp [1009]byte
    l, err := res.Body.Read(temp[:]);
    if l<1009 {
      return &s, errors.New("No sesskey recieved")
    } else if err!=nil {
      return &s, err
    }

    io.Copy(io.Discard, res.Body)
    res.Body.Close()
    if string(temp[987:998]) == `"sesskey":"` {
      s.Sesskey = string(temp[998:1008])
    }
  }

  {
    req, err := http.NewRequest(
      "POST",
      "https://lms.thapar.edu/moodle/lib/ajax/service.php?sesskey="+s.Sesskey,
      bytes.NewBuffer([]byte(`[{"index":0,"methodname":"core_course_get_enrolled_courses_by_timeline_classification","args":{"offset":0,"limit":0,"classification":"allincludinghidden","sort":"fullname","customfieldname":"semestercode","customfieldvalue":""}}]`)),
      )
    if err != nil {
      return nil, err
    }
    req.Header.Add("Cookie", s.Cookie)
    res, err := client.Do(req)
    if err != nil {
      return nil, err
    }
    res.Uncompressed = true
    body, err := io.ReadAll(res.Body)
    res.Body.Close()
    response := string(body)
    fmt.Println(response)

  }
  return &s, nil
}

func Get_lms_courses(s *Session) (*string, error) {

  // req.Header.Add("Cookie", "keep-alive")

  client := <- http_buff
  http_buff <- client

  return nil, nil
}

// -H 'Cookie: MoodleSession=hlt2851rvtcsdmif252hlukt4c' \

