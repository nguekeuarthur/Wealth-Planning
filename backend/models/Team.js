const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    company: {
      type: String,
      trim: true,
      maxlength: 100
    },
    color: {
      type: String,
      default: "#5a8f6f",
      validate: {
        validator: function(v) {
          return /^#[0-9A-F]{6}$/i.test(v);
        },
        message: 'Color must be a valid hex color code'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for better query performance
TeamSchema.index({ leader: 1 });
TeamSchema.index({ members: 1 });

// Virtual for member count
TeamSchema.virtual('memberCount').get(function() {
  return this.members ? this.members.length : 0;
});

// Ensure leader is also in members array
TeamSchema.pre('save', function(next) {
  if (this.leader && !this.members.includes(this.leader)) {
    this.members.push(this.leader);
  }
  next();
});

module.exports = mongoose.model("Team", TeamSchema);
