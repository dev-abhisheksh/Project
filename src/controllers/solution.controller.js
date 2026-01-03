import mongoose from "mongoose";
import { Problem } from "../models/problem.model.js";
import { Solution } from "../models/solution.model.js";


const createSolution = async (req, res) => {
    try {
        const { problemId } = req.params;
        let { answer } = req.body;

        if (!problemId || !answer) {
            return res.status(400).json({ message: "ProblemId and answer is required" })
        }

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({ message: "Invalid Problem" })
        }

        answer = answer.trim();

        if (answer === null || answer === "") {
            return res.status(400).json({ message: "Answer should not be empty" })
        }

        if (answer.length < 20 || answer.length > 2000) {
            return res.status(400).json({ message: "Answer length must be between 20 - 2000 letters" })
        }

        const problem = await Problem.findOne({ _id: problemId, isDeleted: false });
        if (!problem) return res.status(404).json({ message: "Problem not found!" })

        if (problem.expertOnly && req.user.role !== "expert") {
            return res.status(403).json({ message: "Only Experts are allowed" })
        }

        const solution = await Solution.create({
            answer,
            problemId,
            answeredBy: req.user?._id,

        })

        return res.status(201).json({
            message: "Solution created successfully",
            solution //testing purpose later ill remove
        })

    } catch (error) {
        console.error("Failed to create a solution", error)
        if (error.code === 11000) {
            return res.status(409).json({ message: "You already submitted a solution" })
        }
        return res.status(500).json({ message: "Failed to create a solution" })
    }
}

const acceptSolution = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction();
    try {
        const solution = await Solution.findById(req.params.solutionId).session(session)
        if (!solution) throw new Error("Solution not found")

        const problem = await Problem.findById(solution.problemId).session(session)
        if (!problem || problem.status !== "open") throw new Error("Invalid problem state")

        if (!problem.createdBy.equals(req.user._id) && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not allowed" })
        }

        solution.isAccepted = true;
        problem.status = "solved"

        await Promise.all([solution.save({ session }), problem.save({ session })])
        await session.commitTransaction()

        return res.status(200).json({ message: "Solution accepted" });
    } catch (error) {
        await session.abortTransaction()
        return res.status(400).json({ message: error.message })
    } finally {
        session.endSession()
    }
}

export {
    createSolution,
    acceptSolution
}