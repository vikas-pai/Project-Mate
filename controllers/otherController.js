import { createCustomError } from "../errors/customError.js";
import connection from "../database.js";

export const getAllIssues = async (req, res, next) => {
  //console.log("Hi from controller");
  try {
    const projectFilter = req.query.projectType;
    const issueFilter = req.query.issueType;
    //console.log(projectFilter, issueFilter);
    //console.log(req.query);
    var query = "";
    if (
      (typeof projectFilter == "undefined" || projectFilter == "allprojects") &&
      issueFilter == "allissues"
    ) {
      query = `select * from issue left join user on  issue.assigneeid=user.userid`;
      console.log("1");
    } else if (projectFilter == "allprojects") {
      query = `select * from issue left join user on  issue.assigneeid=user.userid where assigneeid='${req.cookies.userid}'`;
      console.log("2");
    } else if (issueFilter == "allissues") {
      query = `select * from issue left join user on  issue.assigneeid=user.userid where projectid='${projectFilter}'`;
      console.log("3");
    } else {
      query = `select * from issue left join user on  issue.assigneeid=user.userid where projectid='${projectFilter}' and assigneeid='${req.cookies.userid}'`;
      console.log("4");
    }
    connection.query(query, (err, results) => {
      if (err) throw err;
      //console.log(results);
      res.status(200).json({ results });
    });
  } catch (error) {
    next(error);
  }
};
export const getAllProjects = async (req, res, next) => {
  //console.log("Hi from controller");
  // console.log(req.user.userid);
  try {
    connection.query(`select * from project`, (err, results) => {
      if (err) throw err;
      //console.log(results);
      res.status(200).json({ results });
    });
  } catch (error) {
    next(error);
  }
};
export const getAllUsers = async (req, res, next) => {
  //console.log("Hi from controller");
  // console.log(req.user.userid);
  try {
    connection.query(`select * from user`, (err, results) => {
      if (err) throw err;
      //console.log(results);
      res.status(200).json({ results });
    });
  } catch (error) {
    next(error);
  }
};
export const createIssue = async (req, res, next) => {
  try {
    console.log(req.body);
    var {
      projectName,
      issuePriority,
      issueSummary,
      issueDueDate,
      assigneeName,
      issueDesc,
      issueType,
    } = req.body;
    var reporterId = req.cookies.userid;
    console.log(reporterId);
    var issueName = "";
    connection.query(
      `select * from project where projectid = '${projectName}'`,
      (err, results) => {
        console.log(err);
        if (err) throw err;
        issueName = results[0].projectname + "-" + (results[0].issuecount + 1);
        var query = `insert into issue (projectid, issuetype,status, summary,description,affectversion,fixedversion,priority, assigneeid,reporterid, duedate,issuename) values ('${projectName}','${issueType}','open','${issueSummary}','${issueDesc}','1.0','1.0','${issuePriority}',`;
        if (assigneeName == "Unassigned") {
          assigneeName = "5";
        }
        query += `'${assigneeName}','${reporterId}',`;
        if (issueDueDate == "") {
          query += "null";
        } else {
          query += `'${issueDueDate}'`;
        }
        query += `,'${issueName}')`;
        console.log(issueName);
        connection.query(query, (err, res) => {
          console.log(err);
          connection.query(
            `update project set issuecount=issuecount+1 where projectid='${projectName}'`,
            (err, res) => {
              console.log(err);
            }
          );
        });
      }
    );
    //console.log(projectName,issuePriority, issueSummary, issueDueDate,assigneeName, issueDesc);

    res.status(200).json({ msg: "Issue created" });
  } catch (error) {
    next(error);
  }
};
export const getIssueDetails = async (req, res, next) => {
  try {
    var issueName = req.query.issueName;
    console.log(issueName);
    connection.query(
      `select * from issue left join project on issue.projectid=project.projectid where issuename='${issueName}'`,
      (err, results) => {
        if (err) throw err;
        console.log(results);
        res.status(200).json({ results });
      }
    );
  } catch (error) {
    next(error);
  }
};
export const updateIssueDetails = async (req, res, next) => {
  try {
    var {
      issueName,
      issueSummary,
      issueDesc,
      issueType,
      issuePriority,
      issueDueDate,
      assigneeName,
      affectVersion,
      fixedVersion,
      reporterId,
    } = req.body;
    console.log(issueName);
    var query = `update issue set summary='${issueSummary}', description='${issueDesc}', issuetype='${issueType}', priority='${issuePriority}', duedate='${issueDueDate}', assigneeid='${assigneeName}', affectversion='${affectVersion}', fixedversion='${fixedVersion}', reporterid='${reporterId}' where issuename='${issueName}'`;
    console.log(query);
    connection.query(query, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.status(200).json({ msg: "Issue updated" });
    });
  } catch (error) {
    next(error);
  }
};
export const getProjectDetails = async (req, res, next) => {
    try {
        var projectId = req.query.projectId;
        console.log(projectId);
        connection.query(
          `select * from project where projectid=${projectId}`,
          (err, results) => {
            if (err) throw err;
            console.log(results);
            res.status(200).json({ results });
          });
    } catch (error) {
        
    }
}
export const updateProjectDetails = async (req, res, next) => {
    try {
        var {projectid, projectVersion} = req.body;
        console.log(projectid, projectVersion);
        var query = `update project set projectversion='${projectVersion}' where projectid='${projectid}'`;
        console.log(query);
        connection.query(query, (err, results) => {
            if (err) throw err;
            console.log(results);
            res.status(200).json({ msg: "Project updated" });
          });
    } catch (error) {
        
    }
}
