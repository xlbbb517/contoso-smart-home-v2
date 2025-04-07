"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { XMarkIcon, CameraIcon } from "@heroicons/react/24/outline";

interface Props {
  onVideoClick: (dataUrl: string) => void;
  onClose: () => void;
}

const Video = ({ onVideoClick, onClose }: Props) => {
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo>();
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getMediaDevices = (): Promise<MediaDeviceInfo[]> => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          resolve(devices.filter((device) => device.kind === "videoinput"));
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  useEffect(() => {
    const device = localStorage.getItem("selectedDevice");
    getMediaDevices().then((devices) => {
      setDevices(devices);
      if (device) {
        const parsedDevice = JSON.parse(device);
        setSelectedDevice(
          devices.find((d) => d.deviceId === parsedDevice.deviceId)
        );
      } else {
        setSelectedDevice(devices[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedDevice && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({
          video: { deviceId: selectedDevice.deviceId },
        })
        .then((stream) => {
          videoRef.current!.srcObject = stream;
          setShowCamera(true);
        });
    } else {
      setShowCamera(false);
    }
    if (selectedDevice) {
      localStorage.setItem(
        "selectedDevice",
        JSON.stringify({ deviceId: selectedDevice.deviceId })
      );
    }
  }, [selectedDevice]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      const m = 256;
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(
        videoRef.current.videoWidth * (m / videoRef.current.videoHeight)
      );
      canvas.height = Math.floor(
        videoRef.current.videoHeight * (m / videoRef.current.videoHeight)
      );
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL();
        onVideoClick(image);
      }
    }
  };

  return (
    <div className="fixed backdrop-blur-sm backdrop-brightness-50 h-full w-full z-20">
      <div className="grid h-screen place-items-center z-50">
        <div className="bg-white rounded-xl p-5 flex flex-col shadow-sm border border-gray-100">
          <div className="w-full flex flex-row gap-3">
            <select
              id="device"
              name="country"
              className="grow rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none p-2 text-secondary-light"
              value={selectedDevice?.deviceId}
              title="Select a device"
              onInput={(e: FormEvent<HTMLSelectElement>) =>
                setSelectedDevice(
                  devices.find((d) => d.deviceId === e.currentTarget.value)
                )
              }
            >
              {devices.map((device) => {
                return (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                );
              })}
            </select>
            {showCamera && (
              <div
                className="bg-white rounded-full p-2 shadow-sm border border-gray-200 hover:bg-hover transition-colors cursor-pointer"
                onClick={handleVideoClick}
              >
                <CameraIcon className="w-6 stroke-accent" />
              </div>
            )}
            <div
              className="bg-white rounded-full p-2 shadow-sm border border-gray-200 hover:bg-hover transition-colors cursor-pointer"
              onClick={() => onClose()}
            >
              <XMarkIcon className="w-6 stroke-secondary" />
            </div>
          </div>
          <div className="mt-4">
            <video
              ref={videoRef}
              autoPlay={true}
              className="rounded-lg shadow-sm aspect-auto outline-none overflow-hidden w-[640px] border border-gray-100"
              title="Click to take a picture"
              onClick={handleVideoClick}
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
};

Video.displayName = "Video";
export default Video;
