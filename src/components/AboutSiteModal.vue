<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div 
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 id="modal-title" class="text-lg font-semibold text-gray-900 dark:text-white">このサイトについて</h2>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6 space-y-6">
        <!-- Service Description -->
        <section>
          <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">サービス概要</h3>
          <div class="text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">
            <p>このサイトは、VTuber向けのイラスト・Live2Dモデル制作サービスの料金計算ツールです。</p>
            <p>様々な商品オプションを組み合わせて、お客様のご希望に合わせた制作プランの料金を簡単に計算できます。</p>
            <p>商品をカートに追加して、総額を確認しながらご検討いただけます。</p>
          </div>
        </section>

        <!-- Product Information Disclosure -->
        <section>
          <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">商品情報について</h3>
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <strong>情報更新日：</strong>2025年12月時点<br>
              掲載されている商品情報・料金は予告なく変更される場合があります。<br>
              最新の情報については、正式なお見積もり時にご確認ください。<br>
              このツールで計算された金額は参考価格であり、実際の制作費用とは異なる場合があります。
            </p>
          </div>
        </section>

        <!-- GitHub Link -->
        <section>
          <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">ソースコード</h3>
          <div class="text-gray-600 dark:text-gray-300">
            <p class="mb-3">このサイトのソースコードはGitHubで公開されています。</p>
            <a 
              href="#" 
              @click.prevent="openGitHubLink"
              class="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
              </svg>
              GitHubで見る
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const closeModal = () => {
  emit('close');
};

const openGitHubLink = () => {
  // You can replace this with the actual GitHub repository URL
  const githubUrl = 'https://github.com/your-username/your-repository';
  window.open(githubUrl, '_blank', 'noopener,noreferrer');
};
</script>