const $=id=>document.getElementById(id);
let iconFile=null;
document.querySelectorAll('input[name="sourceType"]').forEach(r=>r.addEventListener('change',()=>{
 const isUrl=document.querySelector('input[name="sourceType"]:checked').value==='url';
 $('fileSource').classList.toggle('hidden',isUrl);$('urlSource').classList.toggle('hidden',!isUrl);
 $('sourceFile').required=!isUrl;$('websiteUrl').required=isUrl;
}));
$('sourceFile').addEventListener('change',()=>{$('fileName').textContent=$('sourceFile').files[0]?.name||'Belum ada file dipilih'});
$('iconFile').addEventListener('change',()=>{
 iconFile=$('iconFile').files[0]||null;$('iconName').textContent=iconFile?.name||'Icon default Vynx';
 if(iconFile){const img=document.createElement('img');img.src=URL.createObjectURL(iconFile);$('iconPreview').replaceChildren(img)}
 else $('iconPreview').textContent='V';
});
$('minSdk').addEventListener('change',()=>{if(+$('targetSdk').value<+$('minSdk').value)$('targetSdk').value=$('minSdk').value});
$('buildForm').addEventListener('submit',async e=>{
 e.preventDefault();
 const cfg=window.VYNX_CONFIG||{},api=(cfg.BUILD_API_URL||'').replace(/\/$/,'');
 if(!api||api.includes('YOUR-BUILD-WORKER')||!cfg.BUILD_API_KEY||cfg.BUILD_API_KEY.includes('CHANGE_ME')){
  alert('Konfigurasikan BUILD_API_URL dan BUILD_API_KEY di web/config.js setelah worker build dipasang.');return;
 }
 const type=document.querySelector('input[name="sourceType"]:checked').value;
 if(type==='url'){try{const u=new URL($('websiteUrl').value);if(!['http:','https:'].includes(u.protocol))throw Error();}catch{alert('Masukkan URL http atau https yang valid.');return}}
 if(+$('minSdk').value>+$('targetSdk').value){alert('Min SDK tidak boleh lebih tinggi dari Target SDK.');return}
 const btn=$('buildBtn'),wrap=$('progressWrap'),result=$('result');
 btn.disabled=true;wrap.classList.remove('hidden');result.classList.add('hidden');$('progressBar').style.width='15%';$('progressText').textContent='Mengirim sumber ke build worker…';$('buildLog').textContent='';
 const fd=new FormData();fd.append('sourceType',type);
 if(type==='url')fd.append('websiteUrl',$('websiteUrl').value.trim());else fd.append('sourceFile',$('sourceFile').files[0]);
 if(iconFile)fd.append('iconFile',iconFile);
 ['appName','packageName','minSdk','targetSdk','versionName','versionCode'].forEach(id=>fd.append(id,$(id).value));
 try{
  $('progressBar').style.width='35%';
  const res=await fetch(api+'/api/build',{method:'POST',headers:{'x-api-key':cfg.BUILD_API_KEY},body:fd});
  const data=await res.json().catch(()=>({error:'Respons worker tidak valid'}));
  if(!res.ok)throw Error(data.error||`Build gagal (${res.status})`);
  $('progressBar').style.width='100%';$('progressText').textContent='Build selesai.';
  $('buildLog').textContent=(data.logs||['APK berhasil dibuat.']).join('\n');
  result.classList.remove('hidden');result.innerHTML='<b>APK siap diunduh</b><p>Unduh APK lalu buka file tersebut di Android. Jika diminta, izinkan instalasi dari sumber ini.</p><a class="download" id="downloadLink" href="'+api+data.downloadPath+'" download>Download APK ↓</a>';
 }catch(err){$('progressBar').style.width='100%';$('progressText').textContent='Build gagal.';$('buildLog').textContent=String(err.message||err);result.classList.add('hidden')}
 finally{btn.disabled=false}
});