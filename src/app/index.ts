class Pdb3dComplexPlugin { 

    targetEle: HTMLElement;
    summaryView: boolean
    pdbevents: any
    
    render(target: HTMLElement, pdbId: string, assemblyId: string, summaryView: boolean) {
        if(typeof target === 'undefined' || typeof pdbId === 'undefined' || typeof assemblyId  === 'undefined') return;
        this.targetEle = <HTMLElement> target;
        this.summaryView = summaryView ? summaryView : false;
        this.getApiData(pdbId.toLowerCase()).then(resultData => {
            if(typeof resultData != 'undefined'){
                let assemblyRecKey = pdbId+'_'+assemblyId;
                if(typeof resultData[pdbId][assemblyRecKey] == 'undefined') return;
                let newData = { ...resultData[pdbId][assemblyRecKey] };
                newData['pdbId'] = pdbId;
                newData['assemblyId'] = assemblyId;
                this.createTemplate(newData);
            }else{

            }
        });
    }

    async getApiData(pdbId: string) {
        try {
          let url = `https://shmoo.weizmann.ac.il/elevy/3dcomplexV5/dataV5/json_v3/${pdbId}.json`;
          return await (await fetch(url)).json();
        } catch (e) {
          console.log(`Couldn't load PDB 3D Complex data`, e);
        }
    }

    addLinks(details:any){
        var text = details["pred_note2"];
        var pisaLink = details["href_PISA"];
        var eppicLink = details["href_EPPIC"];
        text = text.replace(/PISA/g, ' <a href="'+pisaLink+'" target="_blank">PISA</a> ');
        text = text.replace(/EPPIC/g, ' <a href="'+eppicLink+'" target="_blank">EPPIC</a> ');
        
        return text;
    }

    showTooltip(){
        (this.targetEle.querySelector('.pcl-3dcomplex-open') as HTMLElement).style.display = 'none';
        (this.targetEle.querySelector('.pcl-3dcomplex-close') as HTMLElement).style.display = 'block';
        (this.targetEle.querySelector('.pcl-3dcomplex-tooltip')! as HTMLElement).style.display = 'block';
    }

    hideTooltip(){
        (this.targetEle.querySelector('.pcl-3dcomplex-open') as HTMLElement).style.display = 'block';
        (this.targetEle.querySelector('.pcl-3dcomplex-close') as HTMLElement).style.display = 'none';
        (this.targetEle.querySelector('.pcl-3dcomplex-tooltip')! as HTMLElement).style.display = 'none';
    }

    createTemplate(pdbIdDetails:any){

        pdbIdDetails['pred_conf'] = parseFloat(pdbIdDetails['pred_conf']);

        this.targetEle.innerHTML = `<div class="pcl-3dcomplex-wrapper">
            <div class="pcl-3dcomplex-result">
                
                <div class="pcl-3dcomplex-row" style="width:100%;">
                    <span class="pcl-3dcomplex-subheading">Assembly ${pdbIdDetails.assemblyId}</span>
                    <div class="pcl-3dcomplex-row pcl-3dcomplex-logo">
                        ${pdbIdDetails['pred_conf'] < 75 ? `<div><span class="pcl-3dcomplex-circle pcl-3dcomplex-red">&nbsp;</span></div>` : ``}
                        ${(pdbIdDetails['pred_conf'] >= 75 && pdbIdDetails['pred_conf'] < 90) ? `<div><span class="pcl-3dcomplex-circle pcl-3dcomplex-yellow">&nbsp;</span></div>` : ``}
                        ${pdbIdDetails['pred_conf'] > 90 ? `<div><span class="pcl-3dcomplex-circle pcl-3dcomplex-green">&nbsp;</span></div>` : ``}
                    </div>
                </div>
                    
                <div class="pcl-3dComplex-left-section" style="float:left;width:65%">
                    <div class="pcl-3dcomplex-row"><span class="pcl-3dcomplex-label">Confidence : </span> ${pdbIdDetails["pred_conf"]}</div>
                    
                    <div class="pcl-3dcomplex-row"><span class="pcl-3dcomplex-label">No. subunits : </span> ${pdbIdDetails["pdb_nsub"]}</div>
                    
                    <div class="pcl-3dcomplex-row"><span class="pcl-3dcomplex-label">Symmetry : </span> ${pdbIdDetails["pdb_sym"]}</div>
                </div>
                    
                <div class="pcl-3dComplex-right-section" style="width:35%;float:right;">
                    <div class="pcl-3dcomplex-row" style="text-align:center;line-height:0px;">
                        <img src="${pdbIdDetails['pdb_image'].replace('http://', 'https://')}" style="height: 65px;" />
                    </div>
                    ${this.summaryView ? `
                    <div class="pcl-3dcomplex-row">
                        <span class="pcl-3dcomplex-link"><a href="javascript:void(0)" class="pcl-3dcomplex-open">More details</a></span>
                    </div>
                    <div class="pcl-3dcomplex-row">
                        <span class="pcl-3dcomplex-link"><a href="javascript:void(0)" class="pcl-3dcomplex-close" style="display:none">Hide details</a></span>
                    </div>
                    ` : ``}
                </div>
                    
                <!-- Tooltip Section Start Here -->
                <div class="pcl-3dcomplex-tooltip" ${this.summaryView ? `style="display:none"` : ``}>
                    <div class="pcl-3dcomplex-row">
                        <span class="pcl-3dcomplex-subheading">3DComplex & QSbio prediction</span>
                        <!--<a href="javascript:void(0)" class="pcl-3dcomplex-close" title="Close Popup">x</a>-->
                    </div>
                    
                    
                    <div class="pcl-3dComplex-left-section" style="float:left;width:65%;margin-bottom:2px;">
                        <div class="pcl-3dcomplex-row"> <span class="pcl-3dcomplex-label">No. subunits : </span> ${pdbIdDetails["pred_nsub"]}</div>
                        <div class="pcl-3dcomplex-row"><span class="pcl-3dcomplex-label">Symmetry : </span> ${pdbIdDetails["pred_sym"]}</div>
                    </div>
                    
                    <div class="pcl-3dComplex-right-section" style="width:35%;float:right;">
                        <div class="pcl-3dcomplex-row" style="text-align:center;line-height:0px;">
                            <img src="${pdbIdDetails['pred_image'].replace('http://', 'https://')}" style="height:65px;" />
                        </div>
                    </div>
                    
                    ${(pdbIdDetails['pred_note1'] != '' && pdbIdDetails['pred_note1'] != null) ? `
                    <div class="pcl-3dcomplex-row" style="clear:left;line-height:18px;margin-top:2px">
                        <span class="pcl-3dcomplex-label">Evidence : </span> ${pdbIdDetails["pred_note1"]}
                    </div>
                    <div class="pcl-3dcomplex-row" style="clear:left;line-height:18px;float:right;"><a href="${pdbIdDetails['href_QSbio']}" target="_blank">QSbio</a>&nbsp;&nbsp;&nbsp;</div>
                    ` : ``}

                    ${((pdbIdDetails['pred_note1'] == '' || pdbIdDetails['pred_note1'] == null) && pdbIdDetails['pred_note2'] != '' && pdbIdDetails['pred_note2'] != null) ? `
                    <div class="pcl-3dcomplex-row" style="clear:left;line-height:18px;">
                        <span class="pcl-3dcomplex-label">Evidence : </span> <span>${this.addLinks(pdbIdDetails)}</span>
                    </div>
                    ` : ``}
                </div>
                <!-- Tooltip Section End Here -->
            </div>
        </div>`;
        
        (this.targetEle.querySelector('.pcl-3dcomplex-open') as HTMLElement).addEventListener('click', this.showTooltip.bind(this));
        (this.targetEle.querySelector('.pcl-3dcomplex-close') as HTMLElement).addEventListener('click', this.hideTooltip.bind(this));
    }

}

(window as any).Pdb3dComplexPlugin = Pdb3dComplexPlugin;