/**
 * Video Asset URLs Configuration
 * Replace these URLs with your actual video hosting links
 * 
 * Options:
 * - YouTube: https://www.youtube.com/embed/VIDEO_ID
 * - Vimeo: https://vimeo.com/VIDEO_ID
 * - AWS S3: https://bucket.s3.amazonaws.com/video.mp4
 * - Cloudinary: https://res.cloudinary.com/your-cloud/video/upload/...
 * - GitHub Releases: https://github.com/user/repo/releases/download/...
 * - Bunny CDN: https://cdn.example.com/video.mp4
 */

export const VIDEO_URLS = {
  // Hero video
  heroLowAngleTrex:
    "https://res.cloudinary.com/dsdxaxkiz/video/upload/v1779624998/Low-Angle-T-Rex.mp4",

  // Portal/Experience videos
  desertTheropod:
    "https://res.cloudinary.com/dsdxaxkiz/video/upload/v1779624998/Desert-Theropod-Sprint.mp4",
  forestAllosaurus:
    "https://res.cloudinary.com/dsdxaxkiz/video/upload/v1779624998/Forest-Allosaurus.mp4",
  stegosaurusMist:
    "https://res.cloudinary.com/dsdxaxkiz/video/upload/v1779624998/Stegosaurus-in-the-Mist.mp4",
  coastalPterosaurs:
    "https://res.cloudinary.com/dsdxaxkiz/video/upload/v1779624998/Coastal-Pterosaurs.mp4",

  // Modern City T-Rex (GIF)
  modernCityTrex:
    "https://media.giphy.com/media/your-gif-id/giphy.gif",
};

/**
 * SETUP INSTRUCTIONS:
 *
 * 1. CLOUDINARY (Recommended for videos):
 *    - Sign up: https://cloudinary.com
 *    - Upload your videos
 *    - Copy public URL and paste above
 *
 * 2. GITHUB RELEASES:
 *    - Create a release in your GitHub repo
 *    - Upload video files as assets
 *    - Copy download URL: https://github.com/user/repo/releases/download/v1/video.mp4
 *
 * 3. BUNNY CDN:
 *    - Sign up: https://bunny.net
 *    - Upload videos to CDN
 *    - Use CDN URL
 *
 * 4. AWS S3:
 *    - Upload to S3 bucket
 *    - Configure public access
 *    - Use S3 URL
 */
