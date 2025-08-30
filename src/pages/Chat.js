// src/pages/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  TextField,
  IconButton,
  Badge,
  Divider,
  Alert,
  Paper,
  Chip,
} from '@mui/material';
import { Send, AttachFile, Search, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/api';

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChats = async () => {
    try {
      const response = await chatService.getUserChats();
      setChats(response.data);
    } catch (err) {
      console.error('Error loading chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadChat = async id => {
    try {
      const chatResponse = await chatService.getChat(id);
      setActiveChat(chatResponse.data);

      const messagesResponse = await chatService.getChatMessages(id);
      setMessages(messagesResponse.data);

      // Marcar como leído
      await chatService.markAsRead(id);
    } catch (err) {
      console.error('Error loading chat:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    try {
      const response = await chatService.sendMessage(activeChat._id, newMessage);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const ChatListItem = ({ chat }) => {
    const otherParticipant = chat.participants.find(p => p._id !== user._id);
    const lastMessage = chat.lastMessage;
    const isActive = activeChat?._id === chat._id;

    return (
      <ListItem
        button
        selected={isActive}
        onClick={() => {
          navigate(`/chat/${chat._id}`);
          loadChat(chat._id);
        }}
        sx={{
          borderRadius: 2,
          mb: 1,
          '&.Mui-selected': {
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
          },
        }}
      >
        <ListItemAvatar>
          <Badge badgeContent={chat.unreadCount} color="error">
            <Avatar src={otherParticipant?.avatar}>{otherParticipant?.name?.charAt(0)}</Avatar>
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={otherParticipant?.name}
          secondary={
            <Box>
              <Typography variant="body2" noWrap>
                {lastMessage?.content || 'No hay mensajes'}
              </Typography>
              {lastMessage && (
                <Typography variant="caption" color="text.secondary">
                  {new Date(lastMessage.createdAt).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          }
        />
      </ListItem>
    );
  };

  const MessageBubble = ({ message }) => {
    const isOwn = message.sender._id === user._id;

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: isOwn ? 'flex-end' : 'flex-start',
          mb: 1,
        }}
      >
        <Paper
          sx={{
            p: 2,
            maxWidth: '70%',
            bgcolor: isOwn ? 'primary.main' : 'grey.100',
            color: isOwn ? 'primary.contrastText' : 'text.primary',
          }}
        >
          <Typography variant="body2">{message.content}</Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.5,
              opacity: 0.7,
              textAlign: 'right',
            }}
          >
            {new Date(message.createdAt).toLocaleTimeString()}
          </Typography>
        </Paper>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Cargando chats...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, height: 'calc(100vh - 200px)' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Lista de chats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Mis Conversaciones
              </Typography>
              <TextField
                fullWidth
                placeholder="Buscar conversaciones..."
                size="small"
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1 }} />,
                }}
              />
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              {chats.length > 0 ? (
                <List sx={{ p: 1 }}>
                  {chats.map(chat => (
                    <ChatListItem key={chat._id} chat={chat} />
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">No tienes conversaciones aún</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Área de chat */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {activeChat ? (
              <>
                {/* Header del chat */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      sx={{ display: { md: 'none' }, mr: 1 }}
                      onClick={() => navigate('/chat')}
                    >
                      <ArrowBack />
                    </IconButton>
                    <Avatar
                      src={activeChat.participants.find(p => p._id !== user._id)?.avatar}
                      sx={{ mr: 2 }}
                    >
                      {activeChat.participants.find(p => p._id !== user._id)?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {activeChat.participants.find(p => p._id !== user._id)?.name}
                      </Typography>
                      <Chip
                        label={`Sobre: ${activeChat.product.title}`}
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/products/${activeChat.product._id}`)}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Mensajes */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                  {messages.map(message => (
                    <MessageBubble key={message._id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Input de mensaje */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyPress={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      multiline
                      maxRows={3}
                      size="small"
                    />
                    <IconButton color="primary">
                      <AttachFile />
                    </IconButton>
                    <IconButton color="primary" onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send />
                    </IconButton>
                  </Box>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                }}
              >
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Selecciona una conversación
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Escoge un chat de la lista para comenzar a conversar
                  </Typography>
                </Box>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
