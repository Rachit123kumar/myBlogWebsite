import mongoose from "mongoose";

const NumberingSchema = new mongoose.Schema({
    findingId: {
        type: Number,
        default: 1
    },
    number: Number,
    totalLength: Number,

    updatedAt: {
        type: Date,
        default: Date.now

    }
});

const Numbering = mongoose.models.Numbering || mongoose.model("Numbering", NumberingSchema);
export default Numbering;
