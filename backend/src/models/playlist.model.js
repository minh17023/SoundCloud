import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.model.js';
import Song from './song.model.js';

const Playlist = sequelize.define('Playlist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cover_image: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'playlists',
  timestamps: true,
});

const PlaylistSong = sequelize.define('PlaylistSong', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  }
}, {
  tableName: 'playlist_songs',
  timestamps: false,
});

// Associations
User.hasMany(Playlist, { foreignKey: 'user_id' });
Playlist.belongsTo(User, { foreignKey: 'user_id' });

Playlist.belongsToMany(Song, { through: PlaylistSong, foreignKey: 'playlist_id' });
Song.belongsToMany(Playlist, { through: PlaylistSong, foreignKey: 'song_id' });

export { Playlist, PlaylistSong };
