import express from "express";
import {
  getAllUsers,
  getAllIssues,
  getAllProjects,
  createIssue,
  getIssueDetails,
  updateIssueDetails,
  getProjectDetails,
  updateProjectDetails,
} from "../controllers/otherController.js";
const router = express.Router();

router.route("/getAllIssues").get(getAllIssues);
router.route("/getAllIssues/:id").get(getAllIssues);
router.route("/getAllProjects").get(getAllProjects);
router.route("/getAllUsers").get(getAllUsers);
router.route("/createIssue").post(createIssue);
router.route("/getIssueDetails").get(getIssueDetails);
router.route("/updateIssue").post(updateIssueDetails);
router.route("/getProjectDetails").get(getProjectDetails);
router.route("/updateProject").post(updateProjectDetails);
export default router;
