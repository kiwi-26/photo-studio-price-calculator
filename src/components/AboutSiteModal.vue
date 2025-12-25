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
          <div class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">
            <p>このサイトは、<a href="https://www.studio-alice.co.jp/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline">こども写真館「スタジオアリス」</a>の撮影料金を簡単に見積もることができるツールです。</p>
          </div>
        </section>

        <!-- Product Information Disclosure -->
        <section>
          <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">商品情報について</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <strong>情報更新日：</strong>2025年12月時点
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
            掲載されている商品情報・料金は予告なく変更される場合があります。<br>
            最新の情報については上記公式ホームページまたは店舗にてご確認ください。<br>
            このツールで計算された金額は参考価格であり、実際の費用とは異なる場合があります。<br>
            キャラクターと一緒に撮影した場合の追加料金や、特別なキャンペーン、割引などは考慮されていません。
          </p>
        </section>

        <!-- GitHub Link -->
        <section>
          <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">ソースコード</h3>
          <div class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>このサイトのソースコードはGitHubで公開されています。</p>
            <p>
              <a 
                href="https://github.com/kiwi-26/photo-studio-price-calculator" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-blue-600 dark:text-blue-400 underline"
              >
                https://github.com/kiwi-26/photo-studio-price-calculator
              </a>
            </p>
          </div>
        </section>

        <section>
          <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">お問い合わせ</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            ご質問やご意見がございましたら、GitHubのIssue機能をご利用いただくか、Twitter（<a href="https://twitter.com/koga_wiwi" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline">@koga_wiwi</a>）までご連絡ください。
          </p>
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
</script>