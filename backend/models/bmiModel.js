import mongoose from 'mongoose';

const bmiSchema = new mongoose.Schema({
    weight: { type: String, required: true },
    height: { type: String, required: true },
}, {
    timestamps: true,
});
const Bmi = mongoose.model('Bmi', bmiSchema);
export default Bmi;