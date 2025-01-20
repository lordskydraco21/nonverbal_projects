import React, { useState } from 'react';
import './App.css';

// Define types for the data we'll receive from the API
interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface Thumbnails {
  default?: Thumbnail;
  medium?: Thumbnail;
  high?: Thumbnail;
  standard?: Thumbnail;
  maxres?: Thumbnail;
}

interface Localized {
    title?: string;
    description?: string;
}

interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails?: Thumbnails;
  channelTitle: string;
  tags?: string[];
  categoryId: string;
  liveBroadcastContent: string;
  localized?: Localized
}

interface ContentDetails {
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
  regionRestriction?: {
        allowed?: string[];
        blocked?: string[];
  }
  projection: string;
}

interface Player {
    embedHtml:string
}

interface Statistics {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
    favoriteCount?: string;
}
interface Status {
    uploadStatus: string;
    privacyStatus: string;
    license: string;
    embeddable: boolean;
    publicStatsViewable: boolean;
    publishAt?: string;
}
interface TopicDetails {
    topicCategories?: string[];
    topicIds?: string[];
}
interface RecordingDetails {
    recordingDate?: string;
}

interface LiveStreamingDetails {
    scheduledStartTime?: string;
    actualStartTime?: string;
    actualEndTime?: string;
    concurrentViewers?:string;
    activeLiveChatId?: string;
}


interface VideoItem {
  id: string;
  snippet: Snippet;
  contentDetails: ContentDetails;
  player: Player;
  statistics: Statistics;
  status: Status;
  topicDetails?: TopicDetails;
  recordingDetails?: RecordingDetails;
  liveStreamingDetails?: LiveStreamingDetails;
}


function App() {
    const [videoId, setVideoId] = useState<string>('');
    const [videoInfo, setVideoInfo] = useState<VideoItem | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const API_KEY = 'AIzaSyDhf73DqXLCkONOUhWB94xF-JMNHUZcgyI';
        //const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

    const fetchVideoInfo = async () => {
        if (!videoId) {
            setError('Please enter a video ID.');
            return;
        }
        setLoading(true);
        setVideoInfo(null);

        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,player,statistics,status,topicDetails,recordingDetails,liveStreamingDetails&id=${videoId}&key=${API_KEY}`
            );
            const data = await response.json();


            if (data.items && data.items.length > 0) {
                setVideoInfo(data.items[0]);
                setError('');
            } else {
                setError('Video not found or unavailable.');
                setVideoInfo(null);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch video information.');
            setVideoInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: string | undefined): string => {
        if(!num) return 'Unavailable'
        return parseInt(num).toLocaleString()
    }
    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return 'Unavailable'
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch(err) {
            return 'Unavailable';
        }
    };

    return (
        <div className="app-container">
            <h1>YouTube Video Information</h1>

            {/* Input and Fetch Button */}
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter YouTube Video ID"
                    value={videoId}
                    onChange={(e) => setVideoId(e.target.value)}
                />
                <button onClick={fetchVideoInfo} disabled={loading}>
                    Fetch Info
                </button>
            </div>

            {/* Error and Loading Messages */}
            {error && <p className="error-message">{error}</p>}
            {loading && <p>Loading...</p>}

            {/* Video Information */}
            {videoInfo && (
                <div className="video-card">
                    <h2>{videoInfo.snippet.title}</h2>
                    <div className="thumbnail-container">
                     <img  src={videoInfo.snippet.thumbnails?.medium?.url} alt={`${videoInfo.snippet.title} thumbnail`}/>
                    </div>
                    <table className="video-table">
                        <tbody>
                        <tr>
                            <td className="label-column">Published At:</td>
                            <td>{formatDate(videoInfo.snippet.publishedAt)}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Channel ID:</td>
                            <td>{videoInfo.snippet.channelId}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Channel Title:</td>
                            <td>{videoInfo.snippet.channelTitle}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Description:</td>
                            <td>{videoInfo.snippet.description}</td>
                        </tr>
                        {videoInfo.snippet.tags && (
                            <tr>
                                <td className="label-column">Tags:</td>
                                <td>{videoInfo.snippet.tags.join(', ')}</td>
                            </tr>
                        )}
                        <tr>
                            <td className="label-column">Category ID:</td>
                            <td>{videoInfo.snippet.categoryId}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Live Broadcast Content:</td>
                            <td>{videoInfo.snippet.liveBroadcastContent}</td>
                        </tr>
                        {videoInfo.snippet.localized && (
                            <tr>
                                <td className="label-column">Localized Title:</td>
                                <td>{videoInfo.snippet.localized.title || 'Unavailable'}</td>
                            </tr>
                        )}
                        {videoInfo.snippet.localized && (
                            <tr>
                                <td className="label-column">Localized Description:</td>
                                <td>{videoInfo.snippet.localized.description || 'Unavailable'}</td>
                            </tr>
                        )}
                        <tr>
                            <td className="label-column">Duration:</td>
                            <td>{videoInfo.contentDetails.duration}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Dimension:</td>
                            <td>{videoInfo.contentDetails.dimension}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Definition:</td>
                            <td>{videoInfo.contentDetails.definition}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Caption:</td>
                            <td>{videoInfo.contentDetails.caption}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Licensed Content:</td>
                            <td>{videoInfo.contentDetails.licensedContent ? 'Yes' : 'No'}</td>
                        </tr>
                        {videoInfo.contentDetails.regionRestriction && (
                            <tr>
                                <td className="label-column">Region Restriction:</td>
                                <td>{JSON.stringify(videoInfo.contentDetails.regionRestriction)}</td>
                            </tr>
                        )}
                        <tr>
                            <td className="label-column">Projection:</td>
                            <td>{videoInfo.contentDetails.projection}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Embed HTML:</td>
                            <td><div dangerouslySetInnerHTML={{ __html: videoInfo.player.embedHtml}} /></td>
                        </tr>
                        <tr>
                            <td className="label-column">View Count:</td>
                            <td>{formatNumber(videoInfo.statistics.viewCount)}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Like Count:</td>
                            <td>{formatNumber(videoInfo.statistics.likeCount)}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Comment Count:</td>
                            <td>{formatNumber(videoInfo.statistics.commentCount)}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Favorite Count:</td>
                            <td>{formatNumber(videoInfo.statistics.favoriteCount)}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Upload Status:</td>
                            <td>{videoInfo.status.uploadStatus}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Privacy Status:</td>
                            <td>{videoInfo.status.privacyStatus}</td>
                        </tr>
                        <tr>
                            <td className="label-column">License:</td>
                            <td>{videoInfo.status.license}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Embeddable:</td>
                            <td>{videoInfo.status.embeddable ? 'Yes' : 'No'}</td>
                        </tr>
                        <tr>
                            <td className="label-column">Public Stats Viewable:</td>
                            <td>{videoInfo.status.publicStatsViewable ? 'Yes' : 'No'}</td>
                        </tr>
                        {videoInfo.status.publishAt && (
                            <tr>
                                <td className="label-column">Scheduled Publish At:</td>
                                <td>{formatDate(videoInfo.status.publishAt)}</td>
                            </tr>
                        )}
                        {videoInfo.topicDetails && videoInfo.topicDetails.topicCategories && (
                            <tr>
                                <td className="label-column">Topic Categories:</td>
                                <td>{videoInfo.topicDetails.topicCategories.join(', ')}</td>
                            </tr>
                        )}
                        {videoInfo.topicDetails && videoInfo.topicDetails.topicIds && (
                            <tr>
                                <td className="label-column">Topic IDs:</td>
                                <td>{videoInfo.topicDetails.topicIds.join(', ')}</td>
                            </tr>
                        )}
                        {videoInfo.recordingDetails && videoInfo.recordingDetails.recordingDate && (
                            <tr>
                                <td className="label-column">Recording Date:</td>
                                <td>{formatDate(videoInfo.recordingDetails.recordingDate)}</td>
                            </tr>
                        )}
                        {videoInfo.liveStreamingDetails && (
                            <>
                                <tr>
                                    <td className="label-column">Scheduled Start Time:</td>
                                    <td>{formatDate(videoInfo.liveStreamingDetails.scheduledStartTime)}</td>
                                </tr>
                                <tr>
                                    <td className="label-column">Actual Start Time:</td>
                                    <td>{formatDate(videoInfo.liveStreamingDetails.actualStartTime)}</td>
                                </tr>
                                <tr>
                                    <td className="label-column">Actual End Time:</td>
                                    <td>{formatDate(videoInfo.liveStreamingDetails.actualEndTime)}</td>
                                </tr>
                                <tr>
                                    <td className="label-column">Concurrent Viewers:</td>
                                    <td>{formatNumber(videoInfo.liveStreamingDetails.concurrentViewers)}</td>
                                </tr>
                                <tr>
                                    <td className="label-column">Active Live Chat ID:</td>
                                    <td>{videoInfo.liveStreamingDetails.activeLiveChatId}</td>
                                </tr>
                            </>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;