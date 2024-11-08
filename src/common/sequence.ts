import mongoose from 'mongoose'

const counterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number,
})

const Counter = mongoose.model('Counter', counterSchema)

const getNextSequenceValue = async (sequenceName) => {
  let sequenceDocument = await Counter.findById(sequenceName)

  if (!sequenceDocument) {
    sequenceDocument = await Counter.create({
      _id: sequenceName,
      sequence_value: 595,
    })
  } else {
    sequenceDocument = await Counter.findByIdAndUpdate(sequenceName, { $inc: { sequence_value: 1 } }, { new: true })
  }

  return sequenceDocument.sequence_value
}

export default getNextSequenceValue
