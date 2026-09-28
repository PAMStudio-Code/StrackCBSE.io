// Utility to parse YouTube, Spotify, SoundCloud, Apple Music, and direct audio stream URLs

export type ParsedAudioType = 'youtube' | 'spotify' | 'soundcloud' | 'apple' | 'direct';

export interface ParsedAudioInfo {
  type: ParsedAudioType;
  embedUrl: string | null;
  directUrl: string | null;
  platformName: string;
  badgeBg: string;
  badgeText: string;
  iconName: string;
  id: string | null;
}

export function parseAudioUrl(inputUrl: string): ParsedAudioInfo {
  const url = inputUrl.trim();

  // 1. YouTube Detection
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/|music\.youtube\.com\/(?:watch\?v=|playlist\?list=))([^"&?\/\s]{11})/i);
  const ytPlaylistMatch = url.match(/[?&]list=([^"&?\/\s]+)/i);

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`,
      directUrl: null,
      platformName: 'YouTube Music / Video',
      badgeBg: 'bg-red-500/10 text-red-600 border-red-500/20',
      badgeText: 'YouTube',
      iconName: 'youtube',
      id: videoId
    };
  } else if (ytPlaylistMatch && ytPlaylistMatch[1] && (url.includes('youtube.com') || url.includes('music.youtube.com'))) {
    const playlistId = ytPlaylistMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&autoplay=1&rel=0`,
      directUrl: null,
      platformName: 'YouTube Playlist',
      badgeBg: 'bg-red-500/10 text-red-600 border-red-500/20',
      badgeText: 'YouTube Playlist',
      iconName: 'youtube',
      id: playlistId
    };
  }

  // 2. Spotify Detection
  const spotifyMatch = url.match(/open\.spotify\.com\/(track|playlist|album|artist|episode|show)\/([a-zA-Z0-9]+)/i);
  if (spotifyMatch) {
    const mediaType = spotifyMatch[1];
    const mediaId = spotifyMatch[2];
    return {
      type: 'spotify',
      embedUrl: `https://open.spotify.com/embed/${mediaType}/${mediaId}?utm_source=generator&theme=0`,
      directUrl: null,
      platformName: `Spotify ${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}`,
      badgeBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      badgeText: 'Spotify',
      iconName: 'spotify',
      id: mediaId
    };
  }

  // 3. SoundCloud Detection
  if (url.includes('soundcloud.com')) {
    const cleanUrl = url.split('?')[0];
    return {
      type: 'soundcloud',
      embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(cleanUrl)}&color=%2310b981&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`,
      directUrl: null,
      platformName: 'SoundCloud Track',
      badgeBg: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      badgeText: 'SoundCloud',
      iconName: 'soundcloud',
      id: null
    };
  }

  // 4. Apple Music Detection
  if (url.includes('music.apple.com')) {
    const embedAppleUrl = url.replace('music.apple.com', 'embed.music.apple.com');
    return {
      type: 'apple',
      embedUrl: embedAppleUrl,
      directUrl: null,
      platformName: 'Apple Music',
      badgeBg: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      badgeText: 'Apple Music',
      iconName: 'apple',
      id: null
    };
  }

  // 5. Direct Audio Stream / MP3 / Radio fallback
  return {
    type: 'direct',
    embedUrl: null,
    directUrl: url,
    platformName: 'Direct Audio Stream / MP3',
    badgeBg: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    badgeText: 'Direct Stream',
    iconName: 'radio',
    id: null
  };
}
