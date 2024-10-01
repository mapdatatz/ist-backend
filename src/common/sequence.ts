const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number,
})

const Counter = mongoose.model('Counter', counterSchema)

const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true },
  )

  return sequenceDocument.sequence_value
}

export default getNextSequenceValue
