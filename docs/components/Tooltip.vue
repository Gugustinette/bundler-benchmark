<template>
  <div
    ref="tooltipRef"
    class="custom-tooltip"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @focusin="showTooltip"
    @focusout="hideTooltip"
  >
    <!-- Slot for the element that triggers the tooltip -->
    <div class="tooltip-trigger" aria-describedby="tooltip-content">
      <slot name="trigger"></slot>
    </div>

    <!-- Tooltip content -->
    <transition name="tooltip-slide-fade">
      <div
        v-if="isVisible"
        ref="contentRef"
        class="tooltip-content"
        role="tooltip"
        id="tooltip-content"
      >
        <slot name="content"></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const isVisible = ref(false);
const tooltipRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

const showTooltip = () => {
	if (hideTimer) {
		clearTimeout(hideTimer);
		hideTimer = null;
	}
	showTimer = setTimeout(() => {
		isVisible.value = true;
		// Optional: Add a small delay before focusing content for screen readers if needed
		// For simple tooltips, aria-describedby is often sufficient.
	}, 100); // Delay in ms before showing
};

const hideTooltip = () => {
	if (showTimer) {
		clearTimeout(showTimer);
		showTimer = null;
	}
	hideTimer = setTimeout(() => {
		isVisible.value = false;
	}, 50); // Delay in ms before hiding
};

// Accessibility: Close tooltip on Escape key press
const handleKeyDown = (event: KeyboardEvent) => {
	if (event.key === "Escape" && isVisible.value) {
		hideTooltip();
	}
};

onMounted(() => {
	document.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
	document.removeEventListener("keydown", handleKeyDown);
	if (showTimer) clearTimeout(showTimer);
	if (hideTimer) clearTimeout(hideTimer);
});
</script>

<style scoped>
.custom-tooltip {
  position: relative;
  display: inline-block; /* Important for inline elements like spans, buttons */
  width: fit-content; /* Adjust width to content */
}

.tooltip-content {
  position: absolute;
  top: 100%; /* Position below the trigger by default */
  left: 50%;
  transform: translateX(-50%); /* Center the tooltip horizontally */
  z-index: 101; /* Make sure it's above other elements */
  margin-top: 10px; /* Space between trigger and tooltip */
  padding: 8px 12px;
  background-color: #333;
  color: #fff;
  border-radius: 4px;
  font-size: 0.875em;
  white-space: nowrap; /* Prevent wrapping of content */
  pointer-events: none; /* Allow clicks to pass through to elements behind */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Optional: Add an arrow */
.tooltip-content::before {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent #333 transparent;
}

/* --- Dark Mode Styles --- */
.dark-mode .tooltip-content {
  background-color: #212121; /* Darker background for tooltip content */
  color: #eee; /* Lighter text color */
}

.dark-mode .tooltip-content::before {
  border-bottom-color: #212121; /* Match arrow color with background */
}

/* Transition Styles */
.tooltip-slide-fade-enter-active,
.tooltip-slide-fade-leave-active {
  transition: all 0.3s ease;
}

.tooltip-slide-fade-enter-from,
.tooltip-slide-fade-leave-to {
  transform: translate(-50%, 10px); /* Start/end slightly lower */
  opacity: 0;
}
</style>
