import { createApp, reactive,h } from 'vue';
import GlobalDialog from '@/components/template-model/dialog.vue';
import RuntimeTemplate from 'vue3-runtime-template';

const dialogState = reactive({
    entity: "",
    action: "",    //  add , edit , select
    fields: [],
    data: {},

    visible: false,
    title: '',
    width: '50%',
    onConfirm: null,
    onCancel: null
});

const showDialog = (options) => {
    dialogState.entity = options.entity||"";
    dialogState.action = options.action || "add";
    dialogState.fields = options.fields||[];
    dialogState.data = options.data || {};
    dialogState.visible = true;
    dialogState.title = options.title || '';
    dialogState.width = options.width || '50%';
    dialogState.onConfirm = options.onConfirm || (() => { });
    dialogState.onCancel = options.onCancel || (() => { });
};

const hideDialog = () => {
    dialogState.visible = false;
};

const DialogPlugin = {
    install(app) {
        app.config.globalProperties.$dialog = {
            show: showDialog,
            hide: hideDialog
        };

        const dialogApp = createApp({
            setup() {
                return () => h(

                    GlobalDialog,
                    {
                        entity: dialogState.entity,
                        action: dialogState.action,
                        fields: dialogState.fields,
                        data: dialogState.data,
                        visible: dialogState.visible,
                        title: dialogState.title,
                        width: dialogState.width,
                        onConfirm: dialogState.onConfirm,
                        onCancel: dialogState.onCancel,
                        'onUpdate:visible': (val) => { dialogState.visible = val; }
                    }

                    // <GlobalDialog
                    //     entity={dialogState.entity}
                    //     action={dialogState.action}
                    //     fields={dialogState.fields}
                    //     data={dialogState.data}
                    //     visible={dialogState.visible}
                    //     title={dialogState.title}
                    //     width={dialogState.width}
                    //     onConfirm={dialogState.onConfirm}
                    //     onCancel={dialogState.onCancel}
                    //     onUpdate: visible={(val) => { dialogState.visible = val; }}
                    // />
                );
            }
        });
        dialogApp.component('runtime-template', RuntimeTemplate);
        const div = document.createElement('div');
        document.body.appendChild(div);
        dialogApp.mount(div);
    }
};

export default DialogPlugin;