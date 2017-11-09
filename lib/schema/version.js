const mongoose = require('mongoose');

const schema = mongoose.Schema({
  version: String,
  status: Number,
  creationDate: Date,
  applicationDate: Date
});

class Version {
  /**
   * Constants
   */
  static get STATUS_SUCCESS() {
    return 0;
  }
  static get STATUS_CREATED() {
    return 1;
  }
  static get STATUS_RUNNING() {
    return 2;
  }
  static get STATUS_ERROR() {
    return 3;
  }

  get isSuccess() {
    return this.status === Version.STATUS_SUCCESS;
  }

  get isCreated() {
    return this.status === Version.STATUS_CREATED;
  }

  get isRunning() {
    return this.status === Version.STATUS_RUNNING;
  }

  get isError() {
    return this.status === Version.STATUS_ERROR;
  }

  static findCurrent() {
    return this.find({ status: this.STATUS_SUCCESS })
      .limit(1)
      .sort({ version: -1 })
      .shift()
      .exec();
  }
}

schema.loadClass(Version);

module.exports = mongoose.model('DatabaseVersion', schema);
