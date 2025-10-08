<script setup lang="ts">
import DateCalculator from '@/components/DateCalculator.vue';
import { reactive } from 'vue';

// === State Management ===
const state = reactive({
  isAdLoaded: false,
});

setTimeout(() => {
  // Resize iframe that displays ad from https://ads.ivan-lim.com
  // @ts-ignore, iFrameResize is made available by iframeResizer.min.js
  iFrameResize({ log: false }, 'iframe.ads');

  // Display ad element
  state.isAdLoaded = true;
}, 2000);
</script>

<template>
  <VApp>
    <VMain>
      <VContainer class="py-8">
        <VRow justify="center">
          <VCol cols="12" md="8" lg="6">
            <DateCalculator />
          </VCol>
        </VRow>

        <!-- === Ads: MochaHost, Play to Earn === -->
        <VRow>
          <VCol
            class="mt-10 text-center"
            cols="12"
            v-show="state.isAdLoaded"
          >
            <iframe class="ads" src="https://ads.ivan-lim.com" frameborder="0"></iframe>
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
  </VApp>
</template>
