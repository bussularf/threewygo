import React, { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import consumer from '../cable';

const UploadNotification: React.FC = () => {
  const toast = useToast();

  useEffect(() => {
    const subscription = consumer.subscriptions.create("UploadNotificationChannel", {
      received(data: { message: string }) {
        toast({
          title: "Upload Concluído",
          description: data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return null;
};

export default UploadNotification;
