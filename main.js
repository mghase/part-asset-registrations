var contractSource = `
contract DemocraticPartAsset=

  record part = {
         creatorAddress : address,
         partName       : string,
         assetName      : string
             
   }
   
   
  record state ={
          parts : map(int, part),
          totalPart :int
    }
  
  entrypoint init() = {
        parts = {},
        totalPart = 0 
        
        }
  
  stateful entrypoint registerPart(name : string, asset : string) =
        let part ={
            creatorAddress = Call.caller,
            partName       = name,
            assetName      = asset
            }
        
        let index = getTotalPart() +1
        
        put( state { parts[index] = part, totalPart = index})
        
        
        
        
  entrypoint getPart(index :int ) :part =
    state.parts[index]
    
    
  entrypoint getTotalPart() : int =
        state.totalPart
`;
var contractAddress= "ct_KcvgWcMfaMwNvg6ywqMpKAgVVArmjTxzf2KCW7gvCXGz392LB";

var client1 =null;

var partArray = [];
var partTotal =0;

function renderPart() {
    var template=$('#template').html();
    Mustache.parse(template);
    var render = Mustache.render(template, {partArray});
    $('#part-list').html(render)
}

window.addEventListener('load',async () =>{
    $('#loader').show();
    client1 = await Ae.Aepp();
    const contract = await client1.getContractInstance(contractSource, {contractAddress});
   
    const calledGet =await contract.call('getPart',[1],{callStatic : true}).catch(e =>console.error(e))
   console.log('calledGet',calledGet);

   const decodedGet = await calledGet.decode().catch(e =>console.error(e));
   console.log(decodedGet)
    renderPart();
});