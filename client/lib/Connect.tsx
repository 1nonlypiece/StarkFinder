"use client";

import * as React from "react";
import Image from "next/image";
import { Connector, useConnect, useDisconnect } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wallet, X } from "lucide-react";
import { motion } from "framer-motion";

const imageLoader = ({ src }: { src: string }) => src;

interface WalletButtonProps {
  name: string;
  alt: string;
  src: string;
  connector: Connector;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  name,
  alt,
  src,
  connector,
}) => {
  const { connect } = useConnect();
  const isSvg = src?.startsWith("<svg");

  const handleConnectWallet = () => {
    connect({ connector });
    localStorage.setItem("lastUsedConnector", connector.name);
  };

  return (
    <motion.button
      className=" w-full bg-white flex items-center gap-5 rounded-lg py-1 px-5 text-base font-medium text-[#000000]  "
      onClick={handleConnectWallet}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="h-10 w-10 rounded-full overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center ">
        {isSvg ? (
          <div
            className="h-8 w-8"
            dangerouslySetInnerHTML={{ __html: src ?? "" }}
          />
        ) : (
          <Image
            alt={alt}
            loader={imageLoader}
            unoptimized
            src={src}
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
        )}
      </div>
      <span className="flex-1 text-left font-medium text-gray-800 dark:text-gray-100">
        {name}
      </span>
    </motion.button>
  );
};

const ConnectModal: React.FC = () => {
  const { connectors } = useConnect();

  const filteredConnectors = connectors.filter((connector) =>
    connector.name.toLowerCase()
  );

  return (
    <DialogContent className="sm:max-w-[450px] w-[300px]  border border-gray-300  ">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-white">
          Connect a Wallet
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2   ">
          {filteredConnectors.map((connector, index) => (
            <WalletButton
              key={connector.id || index}
              src={
                typeof connector.icon === "object"
                  ? connector.icon.light
                  : connector.icon
              }
              name={connector.name}
              connector={connector}
              alt={`${connector.name} icon`}
            />
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};









interface ConnectButtonProps {
  text?: string;
  className?: string;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
  text = "Connect Wallet",
  className = "",
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`relative
            bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500
            hover:bg-gradient-to-br
            shadow-lg shadow-blue-500/30
            hover:shadow-xl hover:shadow-indigo-500/40
            text-white
            font-semibold
            py-3 px-6
            rounded-xl
            transition-all
            duration-300
            hover:scale-105
            active:scale-100
            ${className}`}
        >
          <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 rounded-xl transition-all"></div>
          <div className="relative flex items-center">
            <Wallet className="mr-2 h-5 w-5 transition-transform group-hover:scale-110 group-hover:animate-bounce" />
            <span className="text-sm tracking-wide group-hover:tracking-wider transition-all">
              {text}
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <ConnectModal />
    </Dialog>








  );
};

interface DisconnectButtonProps {
  className?: string;
}

const DisconnectButton: React.FC<DisconnectButtonProps> = ({ className = "" }) => {
  const { disconnect } = useDisconnect({});
  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDisconnect}
      className={`text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${className}`}
    >
      <X className="h-4 w-4 mr-2" />
      Disconnect
    </Button>
  );
};

export { ConnectButton, DisconnectButton };
