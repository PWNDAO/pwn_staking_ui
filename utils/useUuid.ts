import { ref } from "vue";

const uuid = ref(1);

export default function useUuid() {
  const getUuid = () => uuid.value++;

  return {
    getUuid,
  };
}
