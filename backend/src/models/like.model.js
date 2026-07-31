import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.model.js';
import Song from './song.model.js';

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  }
}, {
  tableName: 'likes',
  timestamps: true,
});

// Associations
User.belongsToMany(Song, { through: Like, foreignKey: 'user_id', as: 'likedSongs' });
Song.belongsToMany(User, { through: Like, foreignKey: 'song_id', as: 'likedBy' });

export default Like;
