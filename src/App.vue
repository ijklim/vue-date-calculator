<template>
  <v-app>
    <v-main>
      <v-container class="py-8">
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <DateCalculator />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import DateCalculator from './components/DateCalculator.vue'
</script>
