import * as Form from '@radix-ui/react-form';
import { useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckIcon } from './icons/CheckIcon';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tooltip } from './Tooltip';
import { InfoIcon } from './icons/InfoIcon';
import { tooltipContent } from '../data/tooltip-content';
import './UpliftRow.css';

export const UpliftRow = ({ uplift, onUpdate, onRemove, id }) => {
  const [percentageError, setPercentageError] = useState('');
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  const handleDelete = () => {
    onRemove(uplift.id);
  };

  const handleTitleChange = (e) => {
    onUpdate({ ...uplift, title: e.target.value });
  };

  const handlePercentageChange = (e) => {
    const value = e.target.value;

    // Validate percentage
    if (value && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
      setPercentageError('Please enter a valid positive number');
    } else if (value && parseFloat(value) > 1000) {
      setPercentageError('Maximum percentage is 1000%');
    } else {
      setPercentageError('');
    }

    onUpdate({ ...uplift, percentage: value });
  };

  const handleMultiplierChange = (checked) => {
    onUpdate({ ...uplift, multiplier: checked });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="uplift-row"
      role="group"
      aria-label={`Uplift: ${uplift.title || 'Untitled uplift'}`}
    >
      <div
        className="drag-handle"
        aria-label="Drag to reorder uplift"
        {...attributes}
        {...listeners}
      >
        <div className="dots-grid">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
      <Form.Root>
        <Form.Field className="form-field" name={`uplift-title-${uplift.id}`}>
        <Form.Control asChild>
          <input
            type="text"
            className="form-input"
            value={uplift.title}
            onChange={handleTitleChange}
            placeholder="Enter uplift title"
            aria-label="Uplift title"
          />
        </Form.Control>
        </Form.Field>

        <Form.Field className="form-field" name={`uplift-percentage-${uplift.id}`}>
          <Form.Control asChild>
            <div className="input-with-suffix">
              <input
                type="number"
                className={`form-input ${percentageError ? 'input-error' : ''}`}
                value={uplift.percentage}
                onChange={handlePercentageChange}
                placeholder="Enter %"
                min="0"
                max="1000"
                step="0.5"
                aria-invalid={!!percentageError}
                aria-describedby={percentageError ? `uplift-percentage-error-${uplift.id}` : undefined}
                aria-label="Uplift percentage"
                required
              />
              <span className="input-suffix">%</span>
            </div>
          </Form.Control>
          {percentageError && (
            <div
              className="form-error-message"
              id={`uplift-percentage-error-${uplift.id}`}
            >
              {percentageError}
            </div>
          )}
        </Form.Field>
      </Form.Root>

      <div className="uplift-controls">
        <div className="multiplier-control">
          <Checkbox.Root
            className="checkbox-root"
            checked={uplift.multiplier}
            onCheckedChange={handleMultiplierChange}
            id={`uplift-multiplier-${uplift.id}`}
          >
            <Checkbox.Indicator className="checkbox-indicator">
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label
            className="checkbox-label"
            htmlFor={`uplift-multiplier-${uplift.id}`}
          >
            Multiplier
            <Tooltip content={tooltipContent.multiplier}>
              <InfoIcon />
            </Tooltip>
          </label>
        </div>

        {uplift.title ? (
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="remove-button"
                aria-label={`Remove uplift: ${uplift.title}`}
              >
                ×
              </button>
            </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content className="dialog-content">
              <Dialog.Title className="dialog-title">Delete Uplift</Dialog.Title>
              <Dialog.Description className="dialog-description">
                Are you sure you want to delete this uplift? This action cannot be undone.
              </Dialog.Description>
              <div className="dialog-buttons">
                <Dialog.Close asChild>
                  <button type="button" className="dialog-cancel" aria-label="Cancel deletion">
                    Cancel
                  </button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="dialog-delete"
                    onClick={handleDelete}
                    aria-label="Confirm deletion"
                  >
                    Delete
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        ) : (
          <button
            type="button"
            className="remove-button"
            onClick={handleDelete}
            aria-label={`Remove uplift: ${uplift.title || 'Untitled uplift'}`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
