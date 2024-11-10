<template>
  <q-page padding>
    <div class="flex justify-between q-mb-md">
      <q-btn
        label="Create Order"
        color="primary"
        @click="openNewOrderForm"
        class="q-mr-md"
      />
      <q-input v-model="searchQuery" placeholder="Search orders by name..." />
    </div>
    <q-table
      title="Order List"
      :rows="filteredOrders"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[5, 10, 20]"
      :expand="expandedRows"
      @expand="onExpand"
    >
      <!-- Custom slot for edit button -->
      <template v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-btn flat icon="edit" @click="editOrder(props.row)" />
          <q-btn flat icon="delete" @click="deleteOrder(props.row)" />
        </q-td>
      </template>

      <!-- Expanded row slot to display order items -->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td colspan="100%">
            <div class="q-pa-sm">
              <div v-if="orderItems[props.row.order_id]">
                <q-list bordered>
                  <q-item
                    v-for="item in orderItems[props.row.order_id]"
                    :key="item.id"
                    class="q-px-md"
                  >
                    <q-item-section>
                      {{ item.item_id }} - Quantity: {{ item.quantity }} -
                      Price:
                      {{ item.price }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div v-else><q-spinner /> Loading items...</div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Add the OrderForm component -->
    <order-form
      ref="orderForm"
      :order="editableOrder"
      :isOpen="isDialogOpen"
      @save="updateOrder"
    />
  </q-page>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Order, OrderItem } from 'src/interfaces/basic';
import Swal from 'sweetalert2';
import OrderForm from 'src/components/OrderComponent.vue';
import { useOrderStore } from 'src/stores/order-store';

export default {
  components: { OrderForm },
  setup() {
    const isDialogOpen = ref(false);
    const orderStore = useOrderStore();
    const orders = ref<Order[]>([]);
    const orderItems = ref<Record<number, OrderItem[]>>({});
    const editableOrder = ref({});
    const searchQuery = ref('');
    const expandedRows = ref<Set<number>>(new Set());

    const openNewOrderForm = () => {
      editableOrder.value = {};
      isDialogOpen.value = true;
    };

    const filteredOrders = computed(() => {
      if (!searchQuery.value) return orders.value;
      return orders.value.filter((order) =>
        order.room_id
          .toString()
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      );
    });

    const editOrder = (order: Order) => {
      editableOrder.value = { ...order };
      isDialogOpen.value = true;
    };

    const deleteOrder = async (order: Order) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this order!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      });

      if (result.isConfirmed) {
        await orderStore.deleteOrder(order.id);
        Swal.fire('Deleted!', 'Your order has been deleted.', 'success');
      }
    };

    const updateOrder = async (order: Order) => {
      await orderStore.updateOrder(order);
      isDialogOpen.value = false;
    };

    const loadOrderItems = async (params: { rows: Order[] }) => {
      const orderIdsToFetch = params.rows
        .map((row) => row.id)
        .filter((id) => !orderItems.value[id]);

      if (orderIdsToFetch.length) {
        await Promise.all(
          orderIdsToFetch.map(async (orderId) => {
            const items = await orderStore.fetchItemsByOrderId(orderId);
            if (items) orderItems.value[orderId] = items;
          })
        );
      }
    };

    const onExpand = async (expanded: boolean, row: Order) => {
      if (expanded && !orderItems.value[row.id]) {
        const items = await orderStore.fetchItemsByOrderId(row.id);
        if (items) {
          orderItems.value[row.id] = items;
        }
      }
    };

    onMounted(async () => {
      await orderStore.fetchOrders();
      orders.value = orderStore.getOrders;
    });

    return {
      isDialogOpen,
      orders,
      orderItems,
      editableOrder,
      searchQuery,
      openNewOrderForm,
      filteredOrders,
      editOrder,
      deleteOrder,
      updateOrder,
      expandedRows,
      loadOrderItems,
      onExpand,
      columns: [
        {
          name: 'order_id',
          label: 'Order ID',
          field: 'order_id',
          sortable: true,
        },
        {
          name: 'room_id',
          label: 'Room ID',
          field: 'room_id',
          sortable: true,
        },
        {
          name: 'start_time',
          label: 'Start Time',
          field: 'start_time',
          sortable: true,
        },
        {
          name: 'end_time',
          label: 'End Time',
          field: 'end_time',
          sortable: true,
        },
        {
          name: 'status',
          label: 'Status',
          field: 'status',
          sortable: true,
        },
        {
          name: 'edit',
          label: 'Actions',
          field: 'actions', // Add a placeholder field
          sortable: false,
        },
      ],
    };
  },
};
</script>
