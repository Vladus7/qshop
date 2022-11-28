import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IProduct} from "../../models/product";
import {ProductsService} from "../../services/products.service";
import {filter, from, fromEvent, interval, map, take} from "rxjs";
import {scan} from "rxjs/operators";
import {products} from "../../data/products";

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements AfterViewInit, OnInit {
  // products: IProduct[] = []
  @ViewChild('myCanvas') canvas: ElementRef;
  @ViewChild('myClean') clearButton: ElementRef;

  constructor(
    public productsService: ProductsService) { }

  ngOnInit(): void {
    // this.productsService.getAll().pipe(
    //   take(2),
    //   filter(p => p.rating.rate < 3),
    // ).subscribe( console.log)

    // const arr$ = from([1,2,3,4,5]).pipe(
    //   filter(v => v < 3),
    //   scan((acc: number[], v) => acc.concat(v), [])
    // )
    // arr$.subscribe(val => console.log(val));

    from(products).pipe(
      // take(products.length),
      filter(v=> v.rating.rate < 3),
      map(v => v.title),
      scan((acc:string[], v) => acc.concat(v), [])
    )
    .subscribe(r => console.log(r))

  // this.productsService.getAll().pipe(
  //     map(arrayOfArrays => arrayOfArrays.map(
  //       array => array.first(el => el.whatever === whateverValue))
  //     )
  //   )
  }

  log() {
    console.log("mouse down")
  }

  logKeyDown() {
    console.log("key down")
  }

  ngAfterViewInit() {
    this.paint();
    this.clear();
  }

  paint(): void{
    fromEvent(this.canvas.nativeElement, 'mousemove')
      .pipe(
        map((e: any)  => ({
          x: e.offsetX,
          y: e.offsetY,
          ctx: e.target.getContext('2d')
        })
      ))
      .subscribe(res => res.ctx.fillRect(res.x, res.y,2,2))
  }

  clear(): void{
    fromEvent(this.clearButton.nativeElement, 'click')
      .subscribe(() => {
        this.canvas.nativeElement.getContext('2d').clearRect(0, 0,this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      })
  }
}
