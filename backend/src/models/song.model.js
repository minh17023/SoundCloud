import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.model.js';

const Song = sequelize.define('Song', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  audio_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cover_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  listens: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  tableName: 'songs',
  timestamps: true,
});

// Associations
User.hasMany(Song, { foreignKey: 'user_id', as: 'songs' });
Song.belongsTo(User, { foreignKey: 'user_id', as: 'uploader' });

export default Song;
