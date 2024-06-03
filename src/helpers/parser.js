'use strict';
import { login, call } from './caller';

async function parsePersonalInfo(cookie){
  try{
    const dom = await call(cookie, 'StudentFiles/PersonalFiles/StudPersonalInfo.jsp');
    const kvp = Array.from(dom.getElementsByTagName('tbody')[0].getElementsByTagName('tr'))
      .map(table_row =>Array.from(table_row.getElementsByTagName('td')).map(_ => _.innerText.trim())
    );
    return {
      name: kvp[0][1],
      enrollment_no: kvp[1][1],
      dob: kvp[4][1],
      course: kvp[5][1],
      semester: kvp[6][1],
      cell_no: kvp[8][1],
      phone_no: kvp[9][1],
      email: kvp[10][1],
      lms_username: kvp[12][1],
      lms_initial_password: kvp[13][1],
      father_name: kvp[2][1],
      mother_name: kvp[3][1],
      parent_cell_no: kvp[8][3],
      parent_phone_no: kvp[9][3],
      parent_email: kvp[10][3],
      current_address: kvp[19][1],
      current_district: kvp[20][1],
      current_city_and_pin: kvp[21][1],
      current_state: kvp[22][1],
      permanant_address: kvp[19][3],
      permanant_district: kvp[20][3],
      permanant_city_and_pin: kvp[21][3],
      permanant_state: kvp[22][3],
      mentor_name: kvp[15][1],
      mentor_department: kvp[16][1],
      mentor_room: kvp[17][1],
      mentor_cell: kvp[15][3],
      mentor_email:kvp[16][3]
    }
  } catch{
    return;
  }
}

async function parseExamMarks(cookie){
  try{
    const dom = await call(cookie, 'StudentFiles/Exam/StudentEventMarksView.jsp?exam=2324EVESEM');
    if (dom == undefined) return;
    return Array.from(dom.getElementById('table-1').getElementsByTagName('tbody')[0].getElementsByTagName('tr')).map(
      tr => {
        const arr = Array.from(tr.getElementsByTagName('td')).map(_=>_.innerText.trim());
        return {
          semester: (arr[1]).substring(2,5).replace('E','A').replace('O','B'),
          subject: arr[2],
          event: arr[3],
          full: parseFloat(arr[4]),
          _full: parseFloat(arr[5]),
          effective: parseFloat(arr[6]),
          _effective: parseFloat(arr[7]),
          status: arr[8],
        };
      }
    );
  } catch{
    return;
  }
}

async function parseGrades(cookie){
  try{
    const dom = await call(cookie, 'StudentFiles/Exam/StudentEventGradesView.jsp?x=&exam=ALL&Subject=ALL');
    return Array.from(dom.getElementById('table-1').getElementsByTagName('tbody')[0].getElementsByTagName('tr')).map(
      tr => {
        const arr = Array.from(tr.getElementsByTagName('td')).map(_=>_.innerText.trim());
        return {
          subject: arr[0],
          semester: arr[1].substring(2,5).replace('E','A').replace('O','B'),
          effective: parseFloat(arr[2]),
          _effective: parseFloat(arr[3]),
          grade: arr[4],
        };
      }
    );
  } catch{
    return;
  }
}

async function parseCGPA(cookie){
  try{
    const dom = await call(cookie, 'StudentFiles/Exam/StudCGPAReport.jsp');
    return Array.from(dom.getElementById('table-1').getElementsByTagName('tbody')[0].getElementsByTagName('tr')).map(
      tr => {
        const arr = Array.from(tr.getElementsByTagName('td')).map(_=>_.innerText.trim());
        return {
          semester: arr[0].substring(2,5).replace('E','A').replace('O','B'),
          credits: parseFloat(arr[1]),
          _credits: parseFloat(arr[2]),
          _points: parseFloat(arr[3]),
          sgpa: parseFloat(arr[4]),
          cgpa: parseFloat(arr[5]),
        };
      }
    );
  } catch{
    return;
  }
}


globalThis.__login = login;
globalThis.__call = call;
globalThis.__parsePersonalInfo = parsePersonalInfo;
globalThis.__parseExamMarks = parseExamMarks;
globalThis.__parseGrades = parseGrades;
globalThis.__parseCGPA = parseCGPA

export {parsePersonalInfo, parseExamMarks, parseGrades, parseCGPA }


