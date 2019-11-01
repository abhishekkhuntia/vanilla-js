/**
 * /////////////////////////////
 *      DIALOG-SERVICE
 * ////////////////////////////
 * Author: Abhishek Khuntia
 * A vanilla javascript based library which will use DOM components in the page to make it as a pop-up.
 * It can make any element as a dialog but will not be able to apply styles. But once dialog is shown, it will have a callback to call, in order to do actions like attaching event handlers and adding classes to the element.
 * Usage:
 * ------
 * 1. Creating a 'DialogService' instance:
 *      var dialogRef = new DialogService();
 * 2. Opening Content of a page in modal format:
 *      dialogRef.openDialog({
 *          templateId: <selector-string>,
 *          softClose: true/false <- This will close Dialog upon clicking on the Modal Shade.
 *          attached: <callback-function>
 *      })
 *      The above will return a Promise in which it will return Data Upon any error or Close dialog Data.
 * 3. Closing Dialog programatically:
 *  In the attached function, 'this' context will have reference to the DialogReference and it can call 'closeDialog'.
 *  Another option is using dialogRef to call 'closeDialog';
 *  Either way if user wishes to pass data to the promise, he/she can pass it as a parameter in closeDialog method.
 *      dialogRef.closeDialog({data:<nothing>});
 */
window.DialogService = (function(){
    var dialogRef;
    function dialogService(){
        this.modalShade = document.getElementById('__delshift-modal') || this.createModalContent('__delshift-modal', '__del-hide');
        this.modalElem = document.getElementById('__delshift-modal-content') || this.createModalContent('__delshift-modal-content', '__del-modal __del-hide');
        this.resolveRef = undefined;
        this.attachDialogStyles()
    }
    dialogService.prototype.createModalContent = function(id, classNames){
        var divEle = document.createElement('div');
            divEle.setAttribute('id', id);
        if(classNames && classNames.length){
            divEle.className = classNames;
        }
        document.body.appendChild(divEle);
        return divEle;
    }
    dialogService.prototype.openDialog = function(option){
        return new Promise((resolve, reject)=> {
            if(dialogRef){
                reject('DIALOG-OPEN-STATE');
            } else if(option.templateId){
                var template = document.querySelector(option.templateId);
                if(!template){
                    reject('TEMPLATE-NOT-FOUND');
                } else if(this.modalElem){
                    this.modalElem.innerHTML = template.innerHTML;
                    this.modalElem.classList.remove('__del-hide');
                    this.modalShade.classList.remove('__del-hide');
                    if(option.attached && typeof(option.attached) == 'function'){
                        option.attached.call(this, this.modalElem);
                    }
                    var _self = this;
                    if(option.softClose){
                        if(!this.modalShade.__delAttached){
                            this.modalShade.__delAttached = true;
                            this.modalShade.addEventListener('click', _self.closeDialog.bind(this));
                        }
                    } else{
                        this.modalShade.__delAttached = false;
                        this.modalShade.removeEventListener('click', this.closeDialog);
                    }
                    this.resolveRef = resolve;
                    document.body.style.overflow = "hidden";
                } else{
                    reject('MODAL-ELEM-MISSING');
                }
            }
        });
    }
    dialogService.prototype.closeDialog = function(data){
        if(this.modalElem && this.modalShade){
            document.body.style.overflow = "";
            this.modalShade.classList.add('__del-hide');
            this.modalElem.classList.add('__del-hide');
            this.modalElem.innerHTML = '';
            if(typeof(this.resolveRef) == 'function'){
                this.resolveRef({status: 'OK', data});
                this.resolveRef = undefined;
            }
            this.modalShade.removeEventListener('click', this.closeDialog);
        }
    }
    dialogService.prototype.attachDialogStyles = function(){
        if(!document.querySelector('style#__delshift-style')){
            var styleEle = document.createElement('style');
            styleEle.setAttribute('id', '__delshift-style');
            styleEle.innerHTML = `
                .__del-hide{
                    display: none !important;
                }
                .__del-modal{
                    background-color: #fff;
                    height: 50vh;
                    position: fixed;
                    top: 25vh;
                    box-sizing: border-box;
                    width: 50%;
                    z-index: 9999;
                    left: 25%;
                    border-radius: 10px;
                    overflow: auto;
                    box-shadow: 0 0 15px #484848;
                    padding: 10px;
                }
                #__delshift-modal{
                    position: fixed;
                    z-index: 9999;
                    background: rgba(72, 72, 72, 0.7);
                    top: 0px;
                    left: 0px;
                    height: 100vh;
                    width: 100%;
                }
            `;
            document.head.appendChild(styleEle);
        }
    }
    return dialogService;
}());