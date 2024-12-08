'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RefreshCw, Wind, Thermometer, Cloud } from 'lucide-react';
import { useCopilotFeatures } from '@/app/contexts/CopilotFeaturesContext';
import { useCopilotChat } from "@copilotkit/react-core";
import { TextMessage, Role } from "@copilotkit/runtime-client-gql";
import { Button } from '@/components/ui/button';
import { useCoAgentStateRender, WeatherAgentState } from '@/hooks/useCoAgentStateRender';
import { ENDPOINTS } from '@/app/configs/endpoints';
import gsap from 'gsap';

type AgentStatus = 'idle' | 'thinking' | 'response' | 'error';

const EnhancedAgentCapabilitiesShowcase: React.FC = () => {
  const {
    executeAction,
    status,
    state,
    streamState
  } = useCoAgentStateRender({
    name: "questions_agent",
    streamEndpoint: `${ENDPOINTS.PRODUCTION.BASE}${ENDPOINTS.PRODUCTION.STREAM}`,
    render: () => null
  });

  const { appState } = useCopilotFeatures();
  const { visibleMessages } = useCopilotChat();
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(cardRef);

  useEffect(() => {
    if (!visibleMessages?.length) return;
    
    const lastMessage = visibleMessages[visibleMessages.length - 1] as TextMessage;
    if (lastMessage?.role === Role.User && lastMessage?.content) {
      console.log('[EnhancedAgentCapabilitiesShowcase] Processing user message:', lastMessage.content);
      executeAction(
        { type: 'processMessage', payload: { message: lastMessage.content } },
        { type: 'processMessage', payload: { message: lastMessage.content } }
      ).catch(error => {
        console.error('[EnhancedAgentCapabilitiesShowcase] Error executing action:', error);
      });
    }
  }, [visibleMessages, executeAction]);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        duration: 0.5,
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  const renderWeatherUI = () => {
    const currentStatus: AgentStatus = status as AgentStatus;
    
    switch (currentStatus) {
      case 'thinking':
        return (
          <motion.div
            className="flex flex-col space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-primary font-medium">Weather Agent is processing your request...</span>
            </div>
            {streamState.currentStep && (
              <motion.div
                className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Current action: {streamState.currentStep}
              </motion.div>
            )}
          </motion.div>
        );
      case 'response':
        if (state && 'final_response' in state) {
          const weatherState = state as unknown as WeatherAgentState;
          return (
            <motion.div
              className="bg-gradient-to-br from-secondary/50 to-secondary rounded-lg p-6 space-y-4 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-bold text-primary">Weather Information</h3>
              <div className="grid gap-4">
                <WeatherInfoItem
                  icon={<Cloud className="w-6 h-6 text-blue-400" />}
                  label="Conditions"
                  value={weatherState.final_response.conditions}
                />
                <WeatherInfoItem
                  icon={<Thermometer className="w-6 h-6 text-red-400" />}
                  label="Temperature"
                  value={`${weatherState.final_response.temperature}°C`}
                />
                <WeatherInfoItem
                  icon={<Wind className="w-6 h-6 text-green-400" />}
                  label="Wind"
                  value={`${weatherState.final_response.wind_speed} km/h ${weatherState.final_response.wind_direction}`}
                />
              </div>
              <motion.div
                className="flex space-x-2 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    console.log('[EnhancedAgentCapabilitiesShowcase] Refreshing weather data');
                    executeAction(
                      { type: 'refreshWeather', payload: {} },
                      { type: 'refreshWeather', payload: {} }
                    ).catch(error => {
                      console.error('[EnhancedAgentCapabilitiesShowcase] Error refreshing weather:', error);
                    });
                  }}
                  disabled={currentStatus !== 'response'}
                  className="group transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500 ease-in-out" />
                  Refresh Data
                </Button>
              </motion.div>
            </motion.div>
          );
        }
        return null;
      case 'error':
        return (
          <motion.div
            className="bg-destructive/10 text-destructive rounded-lg p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h3 className="text-xl font-semibold">Error</h3>
            <p className="text-sm mt-2">
              {streamState.currentStep || 'An error occurred while fetching weather data'}
            </p>
          </motion.div>
        );
      default:
        return (
          <motion.div
            className="bg-secondary/30 backdrop-blur-sm rounded-lg p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-primary">Agent Status</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {appState.lastError || 'Ready for queries'}
            </p>
          </motion.div>
        );
    }
  };

  const renderMetadata = () => (
    <motion.div
      className="mt-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div>
        <h3 className="text-lg font-medium text-primary">Current Step:</h3>
        <p className="text-sm text-muted-foreground mt-1 bg-secondary/30 p-2 rounded-md backdrop-blur-sm">
          {streamState.currentStep || 'Waiting for agent...'}
        </p>
      </div>
      <div>
        <h3 className="text-lg font-medium text-primary">Confidence Level:</h3>
        <div className="flex items-center space-x-2 mt-1">
          <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(streamState.confidence || 0) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-sm text-muted-foreground min-w-[4rem]">
            {streamState.confidence ? `${(streamState.confidence * 100).toFixed(1)}%` : 'N/A'}
          </span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground flex justify-between bg-secondary/20 p-2 rounded-md backdrop-blur-sm">
        <span>Status: {status || 'idle'}</span>
        <span>Events: {streamState.intermediateResults.length}</span>
      </div>
    </motion.div>
  );

  return (
    <Card className="w-full mb-6 overflow-hidden" ref={cardRef}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
        }}
      >
        <CardContent className="space-y-6 p-6">
          <motion.h2
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Agent Capabilities Showcase
          </motion.h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={status}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 }
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {renderWeatherUI()}
            </motion.div>
          </AnimatePresence>
          {renderMetadata()}
        </CardContent>
      </motion.div>
    </Card>
  );
};

const WeatherInfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <motion.div
    className="flex items-center space-x-3"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    {icon}
    <div>
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="ml-2 font-medium">{value}</span>
    </div>
  </motion.div>
);

export default EnhancedAgentCapabilitiesShowcase;