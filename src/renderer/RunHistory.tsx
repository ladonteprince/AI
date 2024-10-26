import { Box, IconButton, HStack, Textarea, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useStore } from './hooks/useStore';
import { extractAction } from '../main/store/extractAction';
import { FaEdit, FaTrash } from 'react-icons/fa';

export function RunHistory() {
  const { runHistory, dispatch } = useStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');

  const messages = runHistory
    .filter((m) => m.role === 'assistant')
    .map((m) => extractAction(m));

  useEffect(() => {
    const element = document.getElementById('run-history');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]); // Scroll when messages change

  const handleEdit = (index: number, text: string) => {
    setEditingIndex(index);
    setEditText(text);
  };

  const handleSave = (index: number) => {
    dispatch({
      type: 'EDIT_HISTORY_ENTRY',
      payload: { index, text: editText },
    });
    setEditingIndex(null);
    setEditText('');
  };

  const handleDelete = (index: number) => {
    dispatch({
      type: 'DELETE_HISTORY_ENTRY',
      payload: index,
    });
  };

  if (runHistory.length === 0) return null;

  return (
    <Box
      id="run-history" // Add ID for scrolling
      w="100%"
      h="100%"
      bg="white"
      borderRadius="16px"
      border="1px solid"
      borderColor="rgba(112, 107, 87, 0.5)"
      p={4}
      overflow="auto"
    >
      {messages.map((action, index) => {
        const { type, ...params } = action.action;
        const isEditing = editingIndex === index;
        return (
          <Box key={index} mb={4} p={3} borderRadius="md" bg="gray.50">
            <Box mb={2} fontSize="sm" color="gray.600">
              {action.reasoning}
            </Box>
            {isEditing ? (
              <Box>
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <Button onClick={() => handleSave(index)}>Save</Button>
              </Box>
            ) : (
              <Box fontFamily="monospace" color="blue.600">
                {type}({params ? JSON.stringify(params) : ''})
              </Box>
            )}
            <HStack spacing={2} mt={2}>
              <IconButton
                icon={<FaEdit />}
                aria-label="Edit"
                size="sm"
                onClick={() => handleEdit(index, JSON.stringify(params))}
              />
              <IconButton
                icon={<FaTrash />}
                aria-label="Delete"
                size="sm"
                onClick={() => handleDelete(index)}
              />
            </HStack>
          </Box>
        );
      })}
    </Box>
  );
}
