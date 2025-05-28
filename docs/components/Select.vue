<template>
  <div
    ref="selectRef"
    class="custom-select"
    :class="{ 'is-open': isOpen, 'is-disabled': disabled }"
    @keydown="handleKeyDown"
    role="combobox"
    :aria-expanded="isOpen"
    aria-haspopup="listbox"
    :aria-label="ariaLabel"
  >
    <div
      class="select-trigger"
      @click="toggleOpen"
      tabindex="0"
      :aria-labelledby="selectedOption ? 'selected-value' : undefined"
      :aria-placeholder="placeholder"
      :aria-disabled="disabled"
    >
      <span v-if="selectedOption" id="selected-value" class="selected-value">
        {{ selectedOption.label }}
      </span>
      <span v-else class="placeholder">{{ placeholder }}</span>
      <span class="arrow"></span>
    </div>

    <transition name="slide-fade">
      <div v-if="isOpen" class="select-options" role="listbox">
        <div
          v-for="(option, index) in options"
          :key="option.value"
          class="select-option"
          :class="{
            'is-selected': selectedOption?.value === option.value,
            'is-disabled': option.disabled,
            'is-focused': focusedIndex === index,
          }"
          @click="selectOption(option)"
          role="option"
          :aria-selected="selectedOption?.value === option.value"
          :aria-disabled="option.disabled"
          :tabindex="option.disabled ? -1 : 0"
        >
          {{ option.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

interface Option {
  // biome-ignore lint/suspicious/noExplicitAny: Using any for flexibility in value types
  value: any;
  label: string;
  disabled?: boolean;
}

const props = defineProps<{
  options: Option[];
  // biome-ignore lint/suspicious/noExplicitAny: Using any for flexibility in value types
  modelValue: any;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue)
);
const selectRef = ref<HTMLElement | null>(null);
const focusedIndex = ref(-1);

const toggleOpen = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      // Set initial focus to the selected option or the first option
      focusedIndex.value = selectedOption.value
        ? props.options.findIndex(
            (option) => option.value === selectedOption.value?.value
          )
        : 0;
    } else {
      focusedIndex.value = -1;
    }
  }
};

const selectOption = (option: Option) => {
  if (!option.disabled) {
    emit("update:modelValue", option.value);
    isOpen.value = false;
    focusedIndex.value = -1; // Reset focused index on close
  }
};

const closeOnOutsideClick = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false;
    focusedIndex.value = -1; // Reset focused index on close
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case "Enter":
    case " ":
      if (isOpen.value) {
        if (focusedIndex.value !== -1) {
          selectOption(props.options[focusedIndex.value]);
        }
      } else {
        toggleOpen();
      }
      event.preventDefault();
      break;
    case "Escape":
      if (isOpen.value) {
        isOpen.value = false;
        focusedIndex.value = -1; // Reset focused index on close
        event.preventDefault();
      }
      break;
    case "ArrowDown":
      if (isOpen.value) {
        event.preventDefault();
        focusedIndex.value = (focusedIndex.value + 1) % props.options.length;
        // Skip disabled options
        while (props.options[focusedIndex.value]?.disabled) {
          focusedIndex.value = (focusedIndex.value + 1) % props.options.length;
        }
        scrollToFocused();
      } else {
        toggleOpen();
      }
      break;
    case "ArrowUp":
      if (isOpen.value) {
        event.preventDefault();
        focusedIndex.value =
          (focusedIndex.value - 1 + props.options.length) %
          props.options.length;
        // Skip disabled options
        while (props.options[focusedIndex.value]?.disabled) {
          focusedIndex.value =
            (focusedIndex.value - 1 + props.options.length) %
            props.options.length;
        }
        scrollToFocused();
      } else {
        toggleOpen();
      }
      break;
    case "Home":
      if (isOpen.value) {
        event.preventDefault();
        focusedIndex.value = 0;
        // Skip disabled options
        while (props.options[focusedIndex.value]?.disabled) {
          focusedIndex.value = (focusedIndex.value + 1) % props.options.length;
        }
        scrollToFocused();
      }
      break;
    case "End":
      if (isOpen.value) {
        event.preventDefault();
        focusedIndex.value = props.options.length - 1;
        // Skip disabled options
        while (props.options[focusedIndex.value]?.disabled) {
          focusedIndex.value =
            (focusedIndex.value - 1 + props.options.length) %
            props.options.length;
        }
        scrollToFocused();
      }
      break;
  }
};

const scrollToFocused = () => {
  const optionsList = selectRef.value?.querySelector(".select-options");
  const focusedOption = optionsList?.children[
    focusedIndex.value
  ] as HTMLElement;
  if (focusedOption && optionsList) {
    const optionsListRect = optionsList.getBoundingClientRect();
    const focusedOptionRect = focusedOption.getBoundingClientRect();

    if (focusedOptionRect.top < optionsListRect.top) {
      optionsList.scrollTop -= optionsListRect.top - focusedOptionRect.top;
    } else if (focusedOptionRect.bottom > optionsListRect.bottom) {
      optionsList.scrollTop +=
        focusedOptionRect.bottom - optionsListRect.bottom;
    }
  }
};

// Watch for modelValue changes to update the focused index when the dropdown is opened
watch(
  () => props.modelValue,
  () => {
    if (isOpen.value) {
      focusedIndex.value = selectedOption.value
        ? props.options.findIndex(
            (option) => option.value === selectedOption.value?.value
          )
        : 0;
    }
  }
);

onMounted(() => {
  document.addEventListener("click", closeOnOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeOnOutsideClick);
});
</script>

<style scoped>
.custom-select {
  position: relative;
  display: inline-block;
  width: 200px;
  font-family: sans-serif;
  user-select: none;
  outline: none; /* Remove default outline, we'll add focus styles */
}

.select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #fff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  color: #333; /* Default text color */
}

.custom-select:focus-within .select-trigger,
.select-trigger:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.custom-select.is-disabled .select-trigger {
  background-color: #f8f9fa;
  cursor: not-allowed;
  border-color: #e9ecef;
  color: #6c757d;
}

.selected-value {
  flex-grow: 1;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.placeholder {
  color: #888;
  flex-grow: 1;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #555;
  transition: transform 0.3s ease;
}

.custom-select.is-open .arrow {
  transform: rotate(180deg);
}

.select-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-height: 200px; /* Adjust for scrollable options */
  overflow-y: auto;
}

.select-option {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  outline: none; /* Remove default outline, we'll add focus styles */
  color: #333; /* Default text color */
}

.select-option:hover:not(.is-disabled) {
  background-color: #f8f9fa;
}

.select-option.is-selected {
  background-color: #007bff;
  color: #fff;
}

.select-option.is-disabled {
  color: #6c757d;
  cursor: not-allowed;
  background-color: #e9ecef;
}

.select-option.is-focused:not(.is-disabled) {
  background-color: #e9ecef; /* A subtle hover/focus style */
}

/* --- Dark Mode Styles --- */
.dark-mode .custom-select .select-trigger {
  background-color: #343a40; /* Dark background for the trigger */
  border-color: #454d55; /* Slightly lighter border */
  color: #e9ecef; /* Light text color */
}

.dark-mode .custom-select.is-disabled .select-trigger {
  background-color: #212529; /* Even darker background for disabled in dark mode */
  border-color: #343a40;
  color: #6c757d;
}

.dark-mode .custom-select .placeholder {
  color: #adb5bd; /* Lighter placeholder color */
}

.dark-mode .custom-select .arrow {
  border-top-color: #e9ecef; /* Light arrow color */
}

.dark-mode .custom-select .select-options {
  background-color: #343a40; /* Dark background for options */
  border-color: #454d55; /* Slightly lighter border */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25); /* Darker shadow */
}

.dark-mode .custom-select .select-option {
  color: #e9ecef; /* Light text color for options */
}

.dark-mode .custom-select .select-option:hover:not(.is-disabled) {
  background-color: #454d55; /* Slightly lighter background on hover */
}

.dark-mode .custom-select .select-option.is-selected {
  background-color: #0056b3; /* Darker blue for selected option */
  color: #fff;
}

.dark-mode .custom-select .select-option.is-disabled {
  color: #6c757d; /* Same disabled text color */
  background-color: #212529; /* Darker disabled background */
}

.dark-mode .custom-select .select-option.is-focused:not(.is-disabled) {
  background-color: #495057; /* Darker focus/hover style */
}

/* Transition Styles */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
