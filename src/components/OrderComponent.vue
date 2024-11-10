<template>
  <q-dialog>
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ order ? 'Edit Order' : 'Create Order' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="saveOrder">
          <!-- Room Selection with Default Rate -->
          <q-select
            v-model="orderData.room_id"
            :options="roomOptions"
            option-label="label"
            option-value="value"
            label="Select Room"
            @input="updateRoomRate"
            outlined
            dense
          />
          <q-input
            v-model="orderData.room_rate"
            label="Room Rate"
            :disable="true"
            outlined
            dense
          />

          <!-- Start Time (Current Time) -->
          <q-input
            v-model="orderData.start_time"
            label="Start Time"
            readonly
            outlined
            dense
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" @click="closeDialog" />
        <q-btn flat label="Save" color="primary" @click="saveOrder" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';
import { Order } from 'src/interfaces/basic';

export default defineComponent({
  props: {
    order: {
      type: Object as PropType<Order | null>,
      default: null,
    },
    isOpen: Boolean,
  },
  emits: ['save', 'update:isOpen'],
  setup(props, { emit }) {
    const orderData = ref({
      room_id: '',
      room_rate: 0,
      start_time: new Date().toISOString().slice(0, 16), // Default to current time
    });

    // Hardcoded room options with default rates
    const roomOptions = [
      { label: 'Room A', value: 'A', rate: 50 },
      { label: 'Room B', value: 'B', rate: 75 },
      { label: 'Room C', value: 'C', rate: 100 },
    ];

    // Update room rate based on selected room
    const updateRoomRate = () => {
      const selectedRoom = roomOptions.find(
        (room) => room.value === orderData.value.room_id
      );
      orderData.value.room_rate = selectedRoom ? selectedRoom.rate : 0;
    };

    // Close dialog
    const closeDialog = () => {
      emit('update:isOpen', false);
    };

    // Save order data and emit save event
    const saveOrder = () => {
      emit('save', orderData.value);
      closeDialog();
    };

    // Watch for prop changes to update form data
    watch(
      () => props.order,
      (newOrder) => {
        if (newOrder) {
          orderData.value = {
            ...newOrder,
            room_id: newOrder.room_id.toString(),
            start_time: newOrder.start_time.toISOString().slice(0, 16),
          };
        }
      },
      { immediate: true }
    );

    return {
      orderData,
      roomOptions,
      updateRoomRate,
      closeDialog,
      saveOrder,
    };
  },
});
</script>

<style scoped>
/* Add any custom styling here */
</style>
