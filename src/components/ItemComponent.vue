<template>
  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">
          {{ isEditMode ? 'Edit Item' : 'Create Item' }}
        </div>
      </q-card-section>

      <q-card-section>
        <!-- Form for item data -->
        <q-input v-model="localItem.name" label="Item Name" />
        <q-input v-model="localItem.price" label="Price" type="number" />
        <q-select
          v-model="localItem.category"
          :options="localCategoryOptions"
          label="Category"
        />

        <div
          v-if="localItem.imageUrl"
          class="q-mt-md"
          @click="triggerFileInput"
        >
          <img
            :src="localItem.imageUrl"
            alt="Image preview"
            class="image-preview"
          />
        </div>

        <input
          v-if="localItem.imageUrl"
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="handleFileChange"
          hidden
        />
        <input
          v-else
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="handleFileChange"
        />
        <!-- Add other fields as needed -->
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Save" color="primary" @click="saveItem" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch, toRefs } from 'vue';
import { useItemStore } from 'src/stores/item-store';

export default {
  props: {
    item: Object,
    category: Object,
    isOpen: Boolean, // Add this prop for external control
  },
  setup(props, { emit }) {
    const { isOpen } = toRefs(props); // Destructure isOpen from props
    const dialog = ref(isOpen.value);
    const localItem = ref({ ...props.item });
    const isEditMode = computed(() => props.item && props.item.id);
    const selectedImage = ref(null);
    const imagePreviewUrl = ref('');
    const fileInput = ref(null);
    const file = ref(null);
    const itemStore = useItemStore();
    const localCategoryOptions = ref([]);

    const triggerFileInput = () => {
      fileInput.value.click();
    };

    const handleFileChange = () => {
      if (fileInput.value && fileInput.value.files.length > 0) {
        file.value = fileInput.value.files[0];
        // Handle the file change logic
        localItem.value.imageUrl = URL.createObjectURL(file.value);
      }
    };

    // Remember to revoke the created URL when it's no longer needed
    watch(
      () => props.isOpen,
      (newValue) => {
        if (!newValue) {
          URL.revokeObjectURL(imagePreviewUrl.value);
          imagePreviewUrl.value = '';
        }
      }
    );

    // Watch for changes in isOpen prop
    watch(isOpen, (newValue) => {
      dialog.value = newValue;
    });

    watch(
      () => props.item,
      (newItem) => {
        localItem.value = { ...newItem };
      },
      { deep: true }
    );

    watch(
      () => props.category,
      (listCategory) => {
        if (Array.isArray(listCategory)) {
          // Transforming each category object in the array to the required format
          localCategoryOptions.value = listCategory.map((cat) => ({
            label: cat.category,
            value: cat.id,
          }));
        } else {
          // Resetting to an empty array if the incoming data is not an array
          localCategoryOptions.value = [];
        }
      },
      { deep: true }
    );

    const saveItem = async () => {
      const item = {
        name: localItem.value.name,
        price: localItem.value.price,
        category_id:
          localItem.value.category.value || localItem.value.category_id,
        imageUrl: localItem.value.imageUrl,
      };

      try {
        if (isEditMode.value) {
          // Existing item: update it
          item.id = localItem.value.id;
          await itemStore.updateItem(item, file.value);
        } else {
          // New item: add it
          await itemStore.saveItem(item, file.value);
        }

        // Clear selected image after saving
        selectedImage.value = null;

        // Close the dialog and refresh the items list
        dialog.value = false;
        emit('save');
      } catch (error) {
        console.error('Error saving item:', error);
        // Handle the error, e.g., show a notification to the user
      }
    };

    return {
      dialog,
      localItem,
      isEditMode,
      selectedImage,
      imagePreviewUrl,
      fileInput,
      localCategoryOptions,
      triggerFileInput,
      handleFileChange,
      saveItem,
    };
  },
};
</script>

<style>
.image-preview {
  max-width: 100%;
  max-height: 200px; /* Adjust the size as needed */
}
</style>
