::@echo off

ECHO OFF
ECHO Hello World

ffmpeg -i %1 -c:v libx265  -b:v 12000k -pix_fmt yuv420p -vf scale=1080:1920 -preset ultrafast  -y "normal/%~n1.mp4"
ffmpeg -i %1 -c:v libx265  -b:v 12000k -pix_fmt yuv420p -vf scale=1080:1920,gblur=sigma=30:steps=3 -preset ultrafast  -y "blurred/%~n1.mp4"


exit