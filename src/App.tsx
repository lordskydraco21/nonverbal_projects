import React, { useState, useEffect } from 'react';
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

interface InfoCardProps {
    title: string;
    children: React.ReactNode;
}
const InfoCard: React.FC<InfoCardProps> = ({title, children}) => {
    return (
        <div className="info-card">
            <h3>{title}</h3>
            {children}
        </div>
    )
}
const InfoRow: React.FC<{label: string; value:string}> = ({label, value}) => {
    return (
    <div className="info-row">
        <span className="label">{label}</span>
        <span className="value">{value}</span>
    </div>
    )
}
function App() {
    const [videoId, setVideoId] = useState<string>('');
    const [videoInfo, setVideoInfo] = useState<VideoItem | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const API_KEY = 'AIzaSyDhf73DqXLCkONOUhWB94xF-JMNHUZcgyI';
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
                <div className="video-grid">
                     <InfoCard title="Video Details">
                      <h2>{videoInfo.snippet.title}</h2>
                         <div className="thumbnail-container">
                           <img  src={videoInfo.snippet.thumbnails?.medium?.url} alt={`${videoInfo.snippet.title} thumbnail`}/>
                         </div>
                      <InfoRow label="Published At" value={formatDate(videoInfo.snippet.publishedAt)} />
                      <InfoRow label="Channel ID" value={videoInfo.snippet.channelId} />
                      <InfoRow label="Channel Title" value={videoInfo.snippet.channelTitle} />
                         <div className="description">
                           <label className='label'>Description:</label>
                           <div className="value">{videoInfo.snippet.description}</div>
                          </div>
                       {videoInfo.snippet.tags && (
                           <InfoRow label="Tags" value={videoInfo.snippet.tags.join(', ')} />
                        )}
                       <InfoRow label="Category ID" value={videoInfo.snippet.categoryId} />
                       <InfoRow label="Live Broadcast Content" value={videoInfo.snippet.liveBroadcastContent} />
                           {videoInfo.snippet.localized && (
                            <>
                             <InfoRow label="Localized Title" value={videoInfo.snippet.localized.title || 'Unavailable'} />
                             <InfoRow label="Localized Description" value={videoInfo.snippet.localized.description || 'Unavailable'} />
                            </>
                           )}

                     </InfoCard>
                    <InfoCard title="Content Details">
                       <InfoRow label="Duration" value={videoInfo.contentDetails.duration} />
                       <InfoRow label="Dimension" value={videoInfo.contentDetails.dimension} />
                       <InfoRow label="Definition" value={videoInfo.contentDetails.definition} />
                       <InfoRow label="Caption" value={videoInfo.contentDetails.caption} />
                       <InfoRow label="Licensed Content" value={videoInfo.contentDetails.licensedContent ? 'Yes' : 'No'} />
                        {videoInfo.contentDetails.regionRestriction && (
                            <InfoRow label="Region Restriction" value={JSON.stringify(videoInfo.contentDetails.regionRestriction)} />
                         )}
                        <InfoRow label="Projection" value={videoInfo.contentDetails.projection} />
                    </InfoCard>
                    <InfoCard title="Player Details">
                          <label className='label'>Embed HTML:</label>
                          <div className="value embed-html" dangerouslySetInnerHTML={{ __html: videoInfo.player.embedHtml}} />
                    </InfoCard>
                    <InfoCard title="Statistics">
                        <InfoRow label="View Count" value={formatNumber(videoInfo.statistics.viewCount)} />
                       <InfoRow label="Like Count" value={formatNumber(videoInfo.statistics.likeCount)} />
                       <InfoRow label="Comment Count" value={formatNumber(videoInfo.statistics.commentCount)} />
                        <InfoRow label="Favorite Count" value={formatNumber(videoInfo.statistics.favoriteCount)} />
                    </InfoCard>
                    <InfoCard title="Status">
                        <InfoRow label="Upload Status" value={videoInfo.status.uploadStatus} />
                        <InfoRow label="Privacy Status" value={videoInfo.status.privacyStatus} />
                        <InfoRow label="License" value={videoInfo.status.license} />
                        <InfoRow label="Embeddable" value={videoInfo.status.embeddable ? 'Yes' : 'No'} />
                        <InfoRow label="Public Stats Viewable" value={videoInfo.status.publicStatsViewable ? 'Yes' : 'No'} />
                           {videoInfo.status.publishAt && (
                           <InfoRow label="Scheduled Publish At" value={formatDate(videoInfo.status.publishAt)} />
                           )}
                       </InfoCard>
                     {videoInfo.topicDetails && (
                         <InfoCard title="Topic Details">
                                  {videoInfo.topicDetails.topicCategories && (
                            <InfoRow label="Topic Categories" value={videoInfo.topicDetails.topicCategories.join(', ')} />
                               )}
                        {videoInfo.topicDetails.topicIds && (
                          <InfoRow label="Topic IDs" value={videoInfo.topicDetails.topicIds.join(', ')} />
                         )}
                       </InfoCard>
                      )}
                      {videoInfo.recordingDetails && videoInfo.recordingDetails.recordingDate && (
                             <InfoCard title="Recording Details">
                                     <InfoRow label="Recording Date" value={formatDate(videoInfo.recordingDetails.recordingDate)} />
                           </InfoCard>
                      )}
                       {videoInfo.liveStreamingDetails && (
                             <InfoCard title="Live Streaming Details">
                                   <InfoRow label="Scheduled Start Time" value={formatDate(videoInfo.liveStreamingDetails.scheduledStartTime)} />
                                   <InfoRow label="Actual Start Time" value={formatDate(videoInfo.liveStreamingDetails.actualStartTime)} />
                                    <InfoRow label="Actual End Time" value={formatDate(videoInfo.liveStreamingDetails.actualEndTime)} />
                                    <InfoRow label="Concurrent Viewers" value={formatNumber(videoInfo.liveStreamingDetails.concurrentViewers)} />
                                   <InfoRow label="Active Live Chat ID" value={videoInfo.liveStreamingDetails.activeLiveChatId} />
                         </InfoCard>
                     )}


                </div>
            )}
        </div>
    );
}

export default App;