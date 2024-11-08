<template>
  <q-page padding>
    <div class="flex justify-between q-mb-md">
      <q-btn
        label="Create Categories"
        color="primary"
        @click="openNewCategoryForm"
        class="q-mr-md"
      />
      <q-input v-model="searchQuery" placeholder="Search category by name..." />
    </div>
    <q-table
      title="Category List"
      :rows="filteredCategory"
      :columns="columns"
      row-key="id"
    >
      <!-- Custom slot for the image column -->
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <img
            :src="`${props.row.imageUrl}`"
            alt="Category Image"
            style="width: 50px; height: 50px"
          />
        </q-td>
      </template>

      <!-- Custom slot for edit button -->
      <template v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-btn flat icon="edit" @click="editCategory(props.row)" />
          <q-btn flat icon="delete" @click="deleteCategory(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Add the CategoryForm component -->
    <category-form
      ref="categoryForm"
      :category="editableCategory"
      :isOpen="isDialogOpen"
      @save="updateCategory"
    />
  </q-page>
</template>

<script lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { QTableColumn } from 'quasar';
import Swal from 'sweetalert2';
import CategoryForm from 'src/components/CategoryComponent.vue';
import { Category } from 'src/interfaces/basic';
import { useItemStore } from 'src/stores/item-store';
import { API_ASSETS } from 'src/stores/constanta';

export default {
  components: { CategoryForm },
  setup() {
    const isDialogOpen = ref(false);
    const itemStore = useItemStore();
    const categories = ref<Category[]>([]);
    const categoryForm = ref<InstanceType<typeof CategoryForm> | null>(null);
    const editableCategory = ref({});
    const searchQuery = ref('');

    const openNewCategoryForm = () => {
      editableCategory.value = {};
      isDialogOpen.value = true;
    };

    const filteredCategory = computed(() => {
      if (!searchQuery.value) return categories.value;
      return categories.value.filter((category) =>
        category.category
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      );
    });

    const columns: QTableColumn[] = [
      {
        name: 'category',
        required: true,
        label: 'Category',
        align: 'left',
        field: (row: Category) => row.category,
        sortable: true,
      },
      {
        name: 'image',
        label: 'Image',
        field: 'imageUrl',
        align: 'center',
        sortable: false,
      },
      {
        name: 'edit',
        label: 'Action',
        field: 'editAction',
        align: 'center',
        sortable: false,
      },
    ];

    const fetchCategories = async () => {
      await itemStore.fetchCategories();
      categories.value = itemStore.categories;
      categories.value.forEach((category) => {
        category.imageUrl = `${API_ASSETS}${category.imageUrl}`;
      });
    };

    const editCategory = (category: Category) => {
      editableCategory.value = category;
      isDialogOpen.value = true;
    };

    const updateCategory = async (category: Category) => {
      //TODO Besok
      console.log(category);
    };

    const deleteCategory = async (category: Category) => {
      if (typeof category.id === 'undefined') {
        Swal.fire('Error', 'Category ID is undefined.', 'error');
        return;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (category.id !== undefined) {
            await itemStore.deleteCategory(category.id);
          } else {
            Swal.fire('Error', 'Category ID is undefined.', 'error');
          }
          await itemStore.fetchCategories();
          categories.value = itemStore.categories;
          Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
        }
      });
    };

    watch(
      () => categoryForm.value?.isOpen,
      (newVal) => {
        if (newVal === false) isDialogOpen.value = false;
      }
    );

    onMounted(fetchCategories);

    return {
      categories,
      columns,
      categoryForm,
      editableCategory,
      isDialogOpen,
      searchQuery,
      filteredCategory,
      openNewCategoryForm,
      editCategory,
      updateCategory,
      deleteCategory,
      fetchCategories,
      API_ASSETS,
    };
  },
};
</script>
