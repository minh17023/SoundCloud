import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.model.js';
import Song from './song.model.js';

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.INTEGER, // second mark in the song
    allowNull: false,
    defaultValue: 0,
  }
}, {
  tableName: 'comments',
  timestamps: true,
});

// Associations
User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

Song.hasMany(Comment, { foreignKey: 'song_id' });
Comment.belongsTo(Song, { foreignKey: 'song_id' });

export default Comment;
