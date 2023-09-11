::@echo off

ECHO OFF
ECHO Hello World

#The delay is on video
ffmpeg -i %1  -itsoffset 1.133 -i %1 -c:v libx265  -b:v 12000k -pix_fmt yuv420p -vf scale=1080:1920 -map 0:v -map 1:a  -preset ultrafast  -y "delayed/%~n1.mp4"





#exit