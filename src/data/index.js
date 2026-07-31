/**
 * Master Curriculum Index
 * Combines all 5 tracks into a single index.
 */
import { JAVA_TRACK }          from './tracks/java.js';
import { SQL_TRACK }           from './tracks/sql.js';
import { JS_TRACK }            from './tracks/javascript.js';
import { REACT_TRACK }         from './tracks/react.js';
import { COMMUNICATION_TRACK } from './tracks/communication.js';

export const TRACKS = [
  JAVA_TRACK,
  SQL_TRACK,
  JS_TRACK,
  REACT_TRACK,
  COMMUNICATION_TRACK,
].filter(Boolean);

export const getTotalTopics = () =>
  TRACKS.reduce((sum, t) => sum + (t?.totalTopics || t?.modules?.flatMap(m => m.topics)?.length || 0), 0);

export const getAllTopics = () =>
  TRACKS.flatMap(t => t?.modules?.flatMap(m => m.topics) || []);

export const findTopic = (id) =>
  getAllTopics().find(t => t.id === id);
