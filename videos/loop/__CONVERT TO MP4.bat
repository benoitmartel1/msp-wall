::@echo off

ECHO OFF
ECHO Hello World

#ffmpeg -i %1 -c:v libvpx -b:v 2000k -threads 16 -auto-alt-ref 0 -y "%~dp1..\webm\%~n1.webm"
ffmpeg -i %1 -c:v libx264  -b:v 8000k -pix_fmt yuv420p -vf scale=-1:1080 -preset ultrafast  -y "lo/%~n1.mp4"

exit